const pool = require('../config/dbConfig');
const {
    handleCreateFolder,
    handleCopyFile,
    handleDeleteFile,
    handleDeleteFolder,
    ChangeToSlug,
} = require('./handleModel');
const Tour = {};
function DataFormat(data) {
    let results = [];
    data.forEach((item) => {
        let listImage = [];
        let listImageUrl = [];

        item.Image
            ? item.Image.split(',').forEach((image) => {
                  const fullPath = `tour/${item.TourId}/${image}`;
                  const fullPathUrl = `${process.env.HOSTNAME}/images/${fullPath}`;
                  listImage.push(fullPath);
                  listImageUrl.push(fullPathUrl);
              })
            : 'default_thumbnail.png';

        let createSlug = item.TourName + ' ' + item.TourId;
        let tour = {
            tour_id: item.TourId,
            tour_name: item.TourName,
            slug: createSlug && ChangeToSlug(createSlug),
            tour_group: item.TourGroup,
            tour_summary: item.TourSummary,
            area: item.Area,
            price: item.Price,
            sale: item.Sale,
            promotion_price: item.Price && item.Sale ? item.Price * (1 - item.Sale / 100) : item.Price,
            departure_schedule: item.DepartureSchedule,
            vehicle: item.Vehicle ? item.Vehicle.split(',') : item.Vehicle,
            time: item.Time,
            describe: item.Describe,
            tour_program: item.TourProgram,
            tour_policy: item.TourPolicy,
            terms_conditions: item.TermsConditions,
            trip: item.Trip,
            guest_type: item.GuestType ? JSON.parse(`[${item.GuestType}]`) : item.GuestType,
            image: item.Image ? listImage : 'default_thumbnail.png',
            thumbnail: item.Thumbnail ? `tour/${item.TourId}/${item.Thumbnail}` : 'default_thumbnail.png',
            created_at: item.CreatedAt,
            update_at: item.UpdateAt,
        };
        tour.thumbnail_url = `${process.env.HOSTNAME}/images/${tour.thumbnail}`;
        tour.image_url = listImageUrl.length ? listImageUrl : `${process.env.HOSTNAME}/images/${tour.image}`;
        results.push(tour);
    });
    return results;
}
Tour.getTour = async (slugIn, callback) => {
    try {
        let [results] = await pool.query(
            `
            SELECT * FROM \`tb_tour\`
            `,
        );
        if (slugIn) {
            const result = DataFormat(results).find(({ slug }) => slug === slugIn);
            if (result) {
                callback(true, `Get tour information ${slugIn} successfully`, result);
            } else {
                callback(false, `Get tour information ${slugIn} does not exist`);
            }
        } else {
            callback(true, 'Get all tour information successfully', DataFormat(results));
        }
    } catch (error) {
        callback(false, 'Get all tour information failed', error);
    }
};

// Tour.getTourById = async (id, callback) => {
//     try {
//         let [result] = await pool.query(
//             `
//                 SELECT * FROM \`tb_tour\`
//                 WHERE TourId =?
//             `,
//             [id],
//         );
//         if (result.length) {
//             callback(true, `Get tour id ${id} successfully`, DataFormat(result));
//         } else {
//             callback(false, `Tour information id ${id} does not exist`);
//         }
//     } catch (error) {
//         callback(false, `Get tour information id ${id} failed`, error);
//     }
// };

Tour.createTour = async (req, callback) => {
    let { thumbnail, detailed_image } = req.files;
    let {
        TourName,
        TourGroup,
        Area,
        Price,
        Sale,
        DepartureSchedule,
        Vehicle,
        Time,
        TourSummary,
        TourProgram,
        TourPolicy,
        TermsConditions,
        Trip,
        GuestType,
    } = req.body;
    let Image = detailed_image ? detailed_image.map((image) => image.filename).toString() : null;
    let Thumbnail = thumbnail ? thumbnail[0].filename : null;
    TourName = TourName ? TourName.trim() : null;
    TourGroup = TourGroup ? TourGroup.trim() : null;
    Area = Area ? Area.trim() : null;
    Price = Price ? Price.trim() : null;
    Sale = Sale ? Sale.trim() : null;
    DepartureSchedule = DepartureSchedule ? DepartureSchedule.trim() : null;
    Vehicle = Vehicle ? Vehicle.trim() : null;
    Time = Time ? Time.trim() : null;
    TourSummary = TourSummary ? TourSummary.trim() : null;
    TourProgram = TourProgram ? TourProgram.trim() : null;
    TourPolicy = TourPolicy ? TourPolicy.trim() : null;
    TermsConditions = TermsConditions ? TermsConditions.trim() : null;
    Trip = Trip ? Trip.trim() : null;
    GuestType = GuestType ? GuestType.toString() : null;
    try {
        let [result] = await pool.query(
            `
            INSERT INTO \`tb_tour\` 
                (TourName,
                TourGroup,
                Area,
                Price,
                Sale,
                DepartureSchedule,
                Vehicle,
                Time,
                TourSummary,
                TourProgram,
                TourPolicy,
                TermsConditions,
                Trip,
                GuestType,
                Image,
                Thumbnail)
            VALUES
                (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
            `,
            [
                TourName,
                TourGroup,
                Area,
                Price,
                Sale,
                DepartureSchedule,
                Vehicle,
                Time,
                TourSummary,
                TourProgram,
                TourPolicy,
                TermsConditions,
                Trip,
                GuestType,
                Image,
                Thumbnail,
            ],
        );
        const folderName = `./src/public/images/tour/${result.insertId}`;
        // Create Folder
        handleCreateFolder(folderName);
        // Copy file
        if (thumbnail) {
            handleCopyFile(thumbnail[0].path, `${folderName}/${thumbnail[0].filename}`);
        }
        if (detailed_image) {
            detailed_image.forEach((image) => {
                handleCopyFile(image.path, `${folderName}/${image.filename}`);
            });
        }
        // Callback
        callback(true, `Create tour information successfully`);
    } catch (error) {
        callback(false, `Create tour information failed`, error);
    }
};

Tour.updateTour = async (req, callback) => {
    let { thumbnail, detailed_image } = req.files;
    let { id } = req.params;
    let [result] = await pool.query(
        `
        SELECT * FROM \`tb_tour\`
        WHERE TourId =?
        `,
        [id],
    );
    let {
        TourName,
        TourGroup,
        Area,
        Price,
        Sale,
        DepartureSchedule,
        Vehicle,
        Time,
        TourSummary,
        TourProgram,
        TourPolicy,
        TermsConditions,
        Trip,
        GuestType,
    } = req.body;
    let Image = detailed_image ? detailed_image.map((image) => image.filename).join(',') : result[0].Image;
    let Thumbnail = thumbnail ? thumbnail[0].filename : result[0].Thumbnail;
    TourName = TourName ? TourName.trim() : null;
    TourGroup = TourGroup ? TourGroup.trim() : null;
    Area = Area ? Area.trim() : null;
    Price = Price ? Price.trim() : null;
    Sale = Sale ? Sale.trim() : null;
    DepartureSchedule = DepartureSchedule ? DepartureSchedule.trim() : null;
    Vehicle = Vehicle ? Vehicle.trim() : null;
    Time = Time ? Time.trim() : null;
    TourSummary = TourSummary ? TourSummary.trim() : null;
    TourProgram = TourProgram ? TourProgram.trim() : null;
    TourPolicy = TourPolicy ? TourPolicy.trim() : null;
    TermsConditions = TermsConditions ? TermsConditions.trim() : null;
    Trip = Trip ? Trip.trim() : null;
    GuestType = GuestType ? GuestType.toString() : null;
    if (detailed_image && result[0].Image) {
        result[0].Image.split(',').forEach((image) => {
            handleDeleteFile(`./src/public/images/tour/${id}/${image}`);
        });
    }
    if (thumbnail && result[0].Thumbnail) {
        handleDeleteFile(`./src/public/images/tour/${id}/${result[0].Thumbnail}`);
    }
    if (result.length) {
        try {
            if (Thumbnail || Image) {
                await pool.query(
                    `
                UPDATE \`tb_tour\` SET 
                    TourName = ?,
                    TourGroup = ?,
                    Area = ?,
                    Price = ?,
                    Sale = ?,
                    DepartureSchedule = ?,
                    Vehicle = ?,
                    Time = ?,
                    TourSummary = ?,
                    TourProgram = ?,
                    TourPolicy = ?,
                    TermsConditions = ?,
                    Trip = ?,
                    GuestType = ?,
                    Image = ?,
                    Thumbnail = ?
                WHERE TourId = ?
            `,
                    [
                        TourName,
                        TourGroup,
                        Area,
                        Price,
                        Sale,
                        DepartureSchedule,
                        Vehicle,
                        Time,
                        TourSummary,
                        TourProgram,
                        TourPolicy,
                        TermsConditions,
                        Trip,
                        GuestType,
                        Image,
                        Thumbnail,
                        id,
                    ],
                );
                const folderName = `./src/public/images/tour/${id}`;
                handleCreateFolder(folderName);
                if (thumbnail) {
                    handleCopyFile(thumbnail[0].path, `${folderName}/${thumbnail[0].filename}`);
                }
                if (detailed_image) {
                    detailed_image.forEach((image) => {
                        handleCopyFile(image.path, `${folderName}/${image.filename}`);
                    });
                }
            } else {
                await pool.query(
                    `
                UPDATE \`tb_tour\` SET 
                    TourName = ?,
                    TourGroup = ?,
                    Area = ?,
                    Price = ?,
                    Sale = ?,
                    DepartureSchedule = ?,
                    Vehicle = ?,
                    Time = ?,
                    TourSummary = ?,
                    TourProgram = ?,
                    TourPolicy = ?,
                    TermsConditions = ?,
                    Trip = ?,
                    GuestType = ?
                WHERE TourId = ?
            `,
                    [
                        TourName,
                        TourGroup,
                        Area,
                        Price,
                        Sale,
                        DepartureSchedule,
                        Vehicle,
                        Time,
                        TourSummary,
                        TourProgram,
                        TourPolicy,
                        TermsConditions,
                        Trip,
                        GuestType,
                        id,
                    ],
                );
            }
            callback(true, `Update tour information ID ${id} successfully`);
        } catch (error) {
            console.log(error);

            callback(false, `Update news information id ${id} failed`, error);
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
        callback(false, `Tour information ID ${id} does not exist`);
    }
};

Tour.deleteTour = async (id, callback) => {
    try {
        await pool.query(
            `
            DELETE FROM \`tb_tour\`
            WHERE TourId =?
            `,
            [id],
        );
        // Delete folder
        handleDeleteFolder(`./src/public/images/tour/${id}`);
        // Callback
        callback(true, `Delete tour information id ${id} successfully`);
    } catch (error) {
        callback(false, `Delete tour information id ${id} failed`, error);
    }
};
module.exports = Tour;
