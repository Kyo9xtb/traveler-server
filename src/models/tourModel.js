const pool = require('../config/dbConfig');
const { handelrCreateFolder, handlerCopyFile, handlerDeleteFile, handelrDeleteFolder } = require('./handlerModel');
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
        let tour = {
            tour_id: item.TourId,
            tour_name: item.TourName,
            tour_group: item.TourGroup,
            area: item.Area,
            price: item.Price,
            sale: item.Sale,
            promotion_price: item.Price && item.Sale ? item.Price * (1 - item.Sale / 100) : item.Price,
            departure_schedule: item.DepartureSchedule,
            vehicle: item.Vehicle,
            time: item.Time,
            describe: item.Describe,
            tour_progarm: item.TourProgram,
            tour_policy: item.TourPolicy,
            terms_conditions: item.TermsConditions,
            trip: item.Trip,
            guest_type: item.GuestType,
            image: item.Image ? listImage : 'default_thumbnail.png',
            thumbnail: item.Thumbnail ? `tour/${item.TourId}/${item.Thumbnail}` : 'default_thumbnail.png',
            create_at: item.CreateAt,
            update_at: item.UpdateAt,
        };
        tour.thumbnail_url = `${process.env.HOSTNAME}/images/${tour.thumbnail}`;
        tour.image_url = listImageUrl.length ? listImageUrl : `${process.env.HOSTNAME}/images/${tour.image}`;
        results.push(tour);
    });
    return results;
}
Tour.getAllTour = async (callback) => {
    try {
        let [results] = await pool.query(`
            SELECT * FROM \`tb_tour\`
            `);
        callback(true, 'Get all tour information successfully', DataFormat(results));
    } catch (error) {
        callback(false, 'Get all tour information failed', error);
    }
};

Tour.getTourById = async (id, callback) => {
    try {
        let [result] = await pool.query(
            `
                SELECT * FROM \`tb_tour\`
                WHERE TourId =?
            `,
            [id],
        );
        if (result.length) {
            callback(true, `Get tour id ${id} successfully`, DataFormat(result));
        } else {
            callback(false, `Tour information id ${id} does not exist`);
        }
    } catch (error) {
        callback(false, `Get tour information id ${id} failed`, error);
    }
};

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
        Description,
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
    Description = Description ? Description.trim() : null;
    TourProgram = TourProgram ? TourProgram.trim() : null;
    TourPolicy = TourPolicy ? TourPolicy.trim() : null;
    TermsConditions = TermsConditions ? TermsConditions.trim() : null;
    Trip = Trip ? Trip.trim() : null;
    GuestType = GuestType ? GuestType.trim() : null;
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
                Description,
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
                Description,
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
        handelrCreateFolder(folderName);
        // Copy file
        if (thumbnail) {
            handlerCopyFile(thumbnail[0].path, `${folderName}/${thumbnail[0].filename}`);
        }
        if (detailed_image) {
            detailed_image.forEach((image) => {
                handlerCopyFile(image.path, `${folderName}/${image.filename}`);
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
    let {
        TourName,
        TourGroup,
        Area,
        Price,
        Sale,
        DepartureSchedule,
        Vehicle,
        Time,
        Description,
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
    Description = Description ? Description.trim() : null;
    TourProgram = TourProgram ? TourProgram.trim() : null;
    TourPolicy = TourPolicy ? TourPolicy.trim() : null;
    TermsConditions = TermsConditions ? TermsConditions.trim() : null;
    Trip = Trip ? Trip.trim() : null;
    GuestType = GuestType ? GuestType.trim() : null;
    let [result] = await pool.query(
        `
        SELECT * FROM \`tb_tour\`
        WHERE TourId =?
        `,
        [id],
    );
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
                    Description = ?,
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
                        Description,
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
                handelrCreateFolder(folderName);
                if (Thumbnail) {
                    handlerCopyFile(thumbnail[0].path, `${folderName}/${thumbnail[0].filename}`);
                }
                if (detailed_image) {
                    detailed_image.forEach((image) => {
                        handlerCopyFile(image.path, `${folderName}/${image.filename}`);
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
                    Description = ?,
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
                        Description,
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
            callback(true, `Update news information id ${id} failed`, error);
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
        handelrDeleteFolder(`./src/public/images/tour/${id}`);
        // Callback
        callback(true, `Delete tour information id ${id} successfully`);
    } catch (error) {
        callback(false, `Delete tour information id ${id} failed`, error);
    }
};
module.exports = Tour;
