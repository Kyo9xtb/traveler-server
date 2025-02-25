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
        const [results] = await pool.query(`
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
        console.error('Error getting info tourist place in model:', error);
        callback(
            false,
            'Get all tourist places failed. A server-side problem occurred. Please come back later.',
            error,
        );
    }
};

TourPlace.getTouristPlaceById = async (id, callback) => {
    try {
        let [result] = await pool.query(
            `
                SELECT * FROM \`tb_tourist-place\`
                WHERE LocationId = ?
            `,
            [id],
        );
        if (result.length) {
            callback(true, `Get tourist places ID ${id} successfully`, DataFormat(result)[0]);
        } else {
            callback(false, `Tourist places ID ${id}  does not exist`);
        }
    } catch (error) {
        console.error('Error getting tourist place by id in model:', error);
        callback(
            false,
            `Get tourist places ID ${id} failed. A server-side problem occurred. Please come back later.`,
            error,
        );
    }
};

TourPlace.createTourPlace = async (req, callback) => {
    let Thumbnail;
    let Image;
    if (req.files) {
        const { thumbnail, detailed_image } = req.files;
        Image = detailed_image ? detailed_image.map((image) => image.filename).toString() : null;
        Thumbnail = thumbnail ? thumbnail[0].filename : null;
    }

    let { location_name, description, details, tour_group, area } = req.body;
    location_name = location_name ? location_name.trim() : null;
    description = description ? description.trim() : null;
    details = details ? details.trim() : null;
    tour_group = tour_group ? tour_group.trim() : null;
    area = area ? area.trim() : null;
    try {
        const [result] = await pool.query(
            `
                INSERT INTO \`tb_tourist-place\` 
                    (
                        LocationName, 
                        Description, 
                        Details,
                        TourGroup, 
                        Area,
                        Image,
                        Thumbnail
                    ) 
                VALUES (?,?,?,?,?,?,?) 
            `,
            [location_name, description, details, tour_group, area, Image, Thumbnail],
        );
        if (result.affectedRows === 0) {
            return callback(false, `Create tourist place failed`);
        } else {
            const folderName = `./src/public/images/tourist_place/${result.insertId}`;
            // Create folder
            handleCreateFolder(folderName);
            // Copy files
            if (req.files) {
                const { thumbnail, detailed_image } = req.files;
                if (thumbnail) {
                    handleCopyFile(thumbnail[0].path, `${folderName}/${thumbnail[0].filename}`);
                }
                if (detailed_image) {
                    detailed_image.forEach((image) => {
                        handleCopyFile(image.path, `${folderName}/${image.filename}`);
                    });
                }
            }
            // callback
            return callback(true, `Create tourist place successfully`, result.insertId);
        }
    } catch (error) {
        console.error('Error creating tourist place in model:', error);
        callback(false, `Create tourist place failed. A server-side problem occurred. Please come back later.`, error);
    }
};

TourPlace.updateTourPlace = async (req, callback) => {
    let { id } = req.params;
    try {
        const [result] = await pool.query(
            `
                SELECT * FROM \`tb_tourist-place\`
                WHERE LocationId = ?
            `,
            [id],
        );
        if (result.length === 0) {
            if (req.files && req.files.thumbnail) {
                handleDeleteFile(req.files.thumbnail[0].path);
            }
            if (req.files && req.files.detailed_image) {
                detailed_image.forEach((image) => {
                    handleDeleteFile(image.path);
                });
            }
            return callback(false, `Tourist place ID ${id} dones not exist`);
        }
        let { LocationName, Description, Details, TourGroup, Area, Image, Thumbnail } = result[0];
        if (req.files) {
            const { thumbnail, detailed_image } = req.files;
            Image = detailed_image ? detailed_image.map((image) => image.filename).toString() : Image;
            Thumbnail = thumbnail ? thumbnail[0].filename : Thumbnail;
            if (detailed_image && result[0].Image) {
                result[0].Image.split(',').forEach((image) => {
                    handleDeleteFile(`./src/public/images/tourist_place/${id}/${image}`);
                });
            }
            if (thumbnail && result[0].Thumbnail) {
                handleDeleteFile(`./src/public/images/tourist_place/${id}/${result[0].Thumbnail}`);
            }
        }
        let { location_name, description, details, tour_group, area } = req.body;
        location_name = location_name ? location_name.trim() : LocationName;
        description = description ? description.trim() : Description;
        details = details ? details.trim() : Details;
        tour_group = tour_group ? tour_group.trim() : TourGroup;
        area = area ? area.trim() : Area;

        const [resultUpdate] = await pool.query(
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
            [location_name, description, details, tour_group, area, Image, Thumbnail, id],
        );
        if (resultUpdate.affectedRows > 0) {
            const folderName = `./src/public/images/tourist_place/${id}`;
            // Create file
            handleCreateFolder(folderName);
            // Copy files
            if (req.files) {
                const { thumbnail, detailed_image } = req.files;
                if (thumbnail) {
                    handleCopyFile(thumbnail[0].path, `${folderName}/${thumbnail[0].filename}`);
                }
                if (detailed_image) {
                    detailed_image.forEach((image) => {
                        handleCopyFile(image.path, `${folderName}/${image.filename}`);
                    });
                }
            }
            return callback(true, `Update tourist place ID ${id} successfully`, id);
        } else {
            return callback(false, `Update tourist place ID ${id} failed`);
        }
    } catch (error) {
        console.error('Error updating tourist place in model', error);
        callback(
            false,
            `Update tourist place ID ${id} failed. A server-side problem occurred. Please come back later.`,
            error,
        );
    }
};

TourPlace.deleteTourPlace = async (id, callback) => {
    try {
        const [resultData] = await pool.query(
            `
                SELECT * FROM \`tb_tourist-place\`
                WHERE LocationId = ?
            `,
            [id],
        );

        if (resultData.length === 0) {
            return callback(false, `Tour information ID ${id} does not exist`);
        }
        const [result] = await pool.query(
            `
            DELETE FROM \`tb_tourist-place\`
            WHERE LocationId = ?
            `,
            [id],
        );
        if (result.affectedRows === 0) {
            return callback(false, `Tourist place ID ${id} does not exist`);
        } else {
            // Delete folder
            handleDeleteFolder(`./src/public/images/tourist_place/${id}`);
            // Callback
            return callback(true, `Delete tourist places ID ${id}  successfully`, result[0]);
        }
    } catch (error) {
        console.error('Error deleting tourist place in model:', error);
        callback(
            false,
            `Delete tourist places ID ${id} failed. A server-side problem occurred. Please come back later.`,
            error,
        );
    }
};
module.exports = TourPlace;
