const pool = require('../config/dbConfig');
const { handlerCopyFile, handlerDeleteFile, handelrDeleteFolder, handelrCreateFolder } = require('./handlerModel');
const TourPlace = {};

function DataFormat(data) {
    let results = [];
    data.forEach((item) => {
        let listImage = [];
        let listImageUrl = [];
        item.Image
            ? item.Image.split(',').forEach((image) => {
                  const fullPath = `tourist_place/${item.LocationId}/${image}`;
                  const fullPathUrl = `${process.env.HOSTNAME}/images/${fullPath}`;
                  listImage.push(fullPath);
                  listImageUrl.push(fullPathUrl);
              })
            : 'default_thumbnail.png';
        let tourist = {
            location_id: item.LocationId,
            location_name: item.LocationName,
            description: item.Description,
            tour_group: item.TourGroup,
            area: item.Area,
            image: item.Image ? listImage : 'default_thumbnail.png',
            thumbnail: item.Thumbnail ? `tourist_place/${item.LocationId}/${item.Thumbnail}` : 'default_thumbnail.png',
            create_at: item.CreateAt,
            update_at: item.UpdateAt,
        };
        tourist.thumbnail_url = `${process.env.HOSTNAME}/images/${tourist.thumbnail}`;
        tourist.image_url = listImageUrl.length ? listImageUrl : `${process.env.HOSTNAME}/images/${tourist.image}`;
        results.push(tourist);
    });
    return results;
}
TourPlace.getAll = async (callback) => {
    try {
        let [results] = await pool.query(`
                SELECT * FROM \`tb_tourist-place\`
            `);
        callback(true, 'Get all tourist places successfully', DataFormat(results));
    } catch (error) {
        callback(false, 'Get all tourist places failed', error);
    }
};

TourPlace.getById = async (id, callback) => {
    try {
        let [result] = await pool.query(
            `
                SELECT * FROM \`tb_tourist-place\`
                WHERE LocationId = ?
            `,
            [id],
        );
        if (result.length) {
            callback(true, `Get tourist places ID ${id} successfully`, DataFormat(result));
        } else {
            callback(false, `Tourist places ID ${id}  does not exist`);
        }
    } catch (error) {
        callback(false, `Get tourist places ID ${id} failed`, error);
    }
};

TourPlace.createTourPlace = async (req, callback) => {
    let { thumbnail, detailed_image } = req.files;
    let { LocationName, Description, TourGroup, Area } = req.body;
    let Image = detailed_image ? detailed_image.map((image) => image.filename).toString() : null;
    let Thumbnail = thumbnail ? thumbnail[0].filename : null;
    LocationName = LocationName ? LocationName.trim() : null;
    Description = Description ? Description.trim() : null;
    TourGroup = TourGroup ? TourGroup.trim() : null;
    Area = Area ? Area.trim() : null;
    try {
        let [result] = await pool.query(
            `
                INSERT INTO \`tb_tourist-place\` 
                    (
                        LocationName, 
                        Description, 
                        TourGroup, 
                        Area,Image,
                        Thumbnail
                    ) 
                VALUES (?,?,?,?,?,?) 
            `,
            [LocationName, Description, TourGroup, Area, Image, Thumbnail],
        );

        const folderName = `./src/public/images/tourist_place/${result.insertId}`;
        // Creare folder
        handelrCreateFolder(folderName);
        // Cpoy files
        if (thumbnail) {
            handlerCopyFile(thumbnail[0].path, `${folderName}/${thumbnail[0].filename}`);
        }
        if (detailed_image) {
            detailed_image.forEach((image) => {
                handlerCopyFile(image.path, `${folderName}/${image.filename}`);
            });
        }
        // callback
        callback(true, `Create tourist place successfully`);
    } catch (error) {
        // console.log(error);
        callback(false, `Create tourist place failed`, error);
    }
};

TourPlace.updateTourPlace = async (req, callback) => {
    let { id } = req.params;
    let { thumbnail, detailed_image } = req.files;
    let { LocationName, Description, TourGroup, Area } = req.body;
    let Image = detailed_image ? detailed_image.map((image) => image.filename).toString() : null;
    let Thumbnail = thumbnail ? thumbnail[0].filename : null;
    LocationName = LocationName ? LocationName.trim() : null;
    Description = Description ? Description.trim() : null;
    TourGroup = TourGroup ? TourGroup.trim() : null;
    Area = Area ? Area.trim() : null;
    let [result] = await pool.query(
        `
            SELECT * FROM \`tb_tourist-place\`
            WHERE LocationId = ?
        `,
        [id],
    );
    if (result.length) {
        try {
            if (Thumbnail || Image) {
                // console.log('Files received');
                await pool.query(
                    `
                    UPDATE \`tb_tourist-place\` SET 
                        LocationName = ?,
                        Description = ?,
                        TourGroup = ?,
                        Area = ?,
                        Image = ?,
                        Thumbnail = ? 
                    WHERE LocationId = ?
                `,
                    [LocationName, Description, TourGroup, Area, Image, Thumbnail, id],
                );
                const folderName = `./src/public/images/tourist_place/${id}`;
                // Create file
                handelrCreateFolder(folderName);
                // Cpoy files
                if (Thumbnail) {
                    handlerCopyFile(thumbnail[0].path, `${folderName}/${thumbnail[0].filename}`);
                }
                if (detailed_image) {
                    detailed_image.forEach((image) => {
                        handlerCopyFile(image.path, `${folderName}/${image.filename}`);
                    });
                }
            } else {
                // console.log('Note Files received');
                await pool.query(
                    `
                    UPDATE \`tb_tourist-place\` SET 
                        LocationName = ?,
                        Description = ?,
                        TourGroup = ?,
                        Area = ?
                    WHERE LocationId = ?
                `,
                    [LocationName, Description, TourGroup, Area, id],
                );
            }
            callback(true, `Update tourist place ID ${id} successfully`);
        } catch (error) {
            callback(false, `Update tourist place ID ${id} failed`, error);
        }
    } else {
        if (thumbnail) {
            handlerDeleteFile(thumbnail[0].path);
        }
        if (detailed_image) {
            detailed_image.forEach((image) => {
                handlerDeleteFile(image.path);
            });
        }
        callback(false, `Update tourist place ID ${id} failed`);
    }
};

TourPlace.deleteTourPlace = async (id, callback) => {
    try {
        await pool.query(
            `
            DELETE FROM \`tb_tourist-place\`
            WHERE LocationId = ?
            `,
            [id],
        );
        // Delete folder
        handelrDeleteFolder(`./src/public/images/tourist_place/${id}`);
        // Callback
        callback(true, `Delete tourist places ID ${id}  successfully`);
    } catch (error) {
        callback(false, `Delete tourist places ID ${id} failed`, error);
    }
};
module.exports = TourPlace;
