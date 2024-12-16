const pool = require('../config/dbConfig');
const {
    handleCopyFile,
    handleDeleteFile,
    ChangeToSlug,
    handleCreateFolder,
    handleDeleteFolder,
} = require('./handleModel');
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
        let createSlug = item.LocationName + ' ' + item.LocationId;
        let tourist = {
            location_id: item.LocationId,
            location_name: item.LocationName,
            slug: item.LocationName ? ChangeToSlug(createSlug) : null,
            description: item.Description,
            details: item.Details,
            tour_group: item.TourGroup,
            area: item.Area,
            image: item.Image ? listImage : 'default_thumbnail.png',
            thumbnail: item.Thumbnail ? `tourist_place/${item.LocationId}/${item.Thumbnail}` : 'default_thumbnail.png',
            created_at: item.CreatedAt,
            update_at: item.UpdateAt,
        };
        tourist.thumbnail_url = `${process.env.HOSTNAME}/images/${tourist.thumbnail}`;
        tourist.image_url = listImageUrl.length ? listImageUrl : `${process.env.HOSTNAME}/images/${tourist.image}`;
        results.push(tourist);
    });
    return results;
}
TourPlace.getTouristPlace = async (slugIn, callback) => {
    try {
        let [results] = await pool.query(`
                SELECT * FROM \`tb_tourist-place\`
            `);
        if (slugIn) {
            const result = DataFormat(results).find(({ slug }) => slug === slugIn);
            if (result) {
                callback(true, `Get tourist place information ${slugIn} successfully`, result);
            } else {
                callback(false, `Get tourist place information ${slugIn} does not exist`);
            }
        } else {
            callback(true, 'Get all tour places successfully', DataFormat(results));
        }
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
                        Area,
                        Image,
                        Thumbnail
                    ) 
                VALUES (?,?,?,?,?,?) 
            `,
            [LocationName, Description, TourGroup, Area, Image, Thumbnail],
        );

        const folderName = `./src/public/images/tourist_place/${result.insertId}`;
        // Create folder
        handleCreateFolder(folderName);
        // Copy files
        if (thumbnail) {
            handleCopyFile(thumbnail[0].path, `${folderName}/${thumbnail[0].filename}`);
        }
        if (detailed_image) {
            detailed_image.forEach((image) => {
                handleCopyFile(image.path, `${folderName}/${image.filename}`);
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
    let [result] = await pool.query(
        `
            SELECT * FROM \`tb_tourist-place\`
            WHERE LocationId = ?
        `,
        [id],
    );
    let { thumbnail, detailed_image } = req.files;
    let { LocationName, Description, TourGroup, Area, Details } = req.body;
    let Image = detailed_image ? detailed_image.map((image) => image.filename).join(',') : result[0].Image;
    let Thumbnail = thumbnail ? thumbnail[0].filename : result[0].Thumbnail;
    LocationName = LocationName ? LocationName.trim() : null;
    Description = Description ? Description.trim() : null;
    TourGroup = TourGroup ? TourGroup.trim() : null;
    Area = Area ? Area.trim() : null;
    Details = Details ? Details.trim() : null;
    if (detailed_image && result[0].Image) {
        result[0].Image.split(',').forEach((image) => {
            handleDeleteFile(`./src/public/images/tourist_place/${id}/${image}`);
        });
    }
    if (thumbnail && result[0].Thumbnail) {
        handleDeleteFile(`./src/public/images/tourist_place/${id}/${result[0].Thumbnail}`);
    }
    console.log(result[0]);

    if (result.length) {
        try {
            if (Thumbnail || Image) {
                // console.log('Files received');
                await pool.query(
                    `
                    UPDATE \`tb_tourist-place\` SET 
                        LocationName = ?,
                        Description = ?,
                        Details = ?,
                        TourGroup = ?,
                        Area = ?,
                        Image = ?,
                        Thumbnail = ?
                    WHERE LocationId = ?
                `,
                    [LocationName, Description, Details, TourGroup, Area, Image, Thumbnail, id],
                );
                const folderName = `./src/public/images/tourist_place/${id}`;
                // Create file
                handleCreateFolder(folderName);
                // Copy files
                if (thumbnail) {
                    handleCopyFile(thumbnail[0].path, `${folderName}/${thumbnail[0].filename}`);
                }
                if (detailed_image) {
                    detailed_image.forEach((image) => {
                        handleCopyFile(image.path, `${folderName}/${image.filename}`);
                    });
                }
            } else {
                // console.log('Note Files received');
                await pool.query(
                    `
                    UPDATE \`tb_tourist-place\` SET 
                        LocationName = ?,
                        Description = ?,
                        Details,
                        TourGroup = ?,
                        Area = ?
                    WHERE LocationId = ?
                `,
                    [LocationName, Description, Details, TourGroup, Area, id],
                );
            }
            callback(true, `Update tourist place ID ${id} successfully`);
        } catch (error) {
            console.log(error);

            callback(false, `Update tourist place ID ${id} failed`, error);
        }
    } else {
        if (thumbnail) {
            handleDeleteFile(thumbnail[0].path);
        }
        if (detailed_image) {
            detailed_image.forEach((image) => {
                handleDeleteFile(image.path);
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
        handleDeleteFolder(`./src/public/images/tourist_place/${id}`);
        // Callback
        callback(true, `Delete tourist places ID ${id}  successfully`);
    } catch (error) {
        callback(false, `Delete tourist places ID ${id} failed`, error);
    }
};
module.exports = TourPlace;
