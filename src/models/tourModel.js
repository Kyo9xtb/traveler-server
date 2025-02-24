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
        const [results] = await pool.query(
            `
            SELECT * FROM \`tb_tour\`
            `,
        );
        if (slugIn) {
            const result = DataFormat(results).find(({ slug }) => slug === slugIn);
            if (result) {
                return callback(true, `Get tour information ${slugIn} successfully`, result);
            } else {
                return callback(false, `Get tour information ${slugIn} does not exist`);
            }
        } else {
            return callback(true, 'Get all tour information successfully', DataFormat(results));
        }
    } catch (error) {
        console.error('Error getting tour information in model', error);
        return callback(
            false,
            `Get all tour information failed. A server-side problem occurred. Please come back later.`,
            error,
        );
    }
};

Tour.getTourById = async (id, callback) => {
    try {
        const [result] = await pool.query(
            `
                SELECT * FROM \`tb_tour\`
                WHERE TourId = ?
            `,
            [id],
        );
        if (result.length) {
            return callback(true, `Get tour id ${id} successfully`, DataFormat(result)[0]);
        } else {
            return callback(false, `Tour information id ${id} does not exist`);
        }
    } catch (error) {
        console.error('Error getting tour information by id in model', error);
        return callback(
            false,
            `Get tour information id ${id} failed. A server-side problem occurred. Please come back later.`,
            error,
        );
    }
};

Tour.createTour = async (req, callback) => {
    let Image;
    let Thumbnail;
    if (req.files) {
        const { thumbnail, detailed_image } = req.files;
        Image = detailed_image ? detailed_image.map((image) => image.filename).toString() : null;
        Thumbnail = thumbnail ? thumbnail[0].filename : null;
    }
    let {
        tour_policy,
        terms_conditions,
        sale,
        tour_name,
        tour_summary,
        tour_program,
        trip,
        tour_group,
        area,
        price,
        departure_schedule,
        vehicle,
        time,
        guest_type,
    } = req.body;

    tour_name = tour_name ? tour_name.trim() : null;
    tour_group = tour_group ? tour_group.trim() : null;
    area = area ? area.trim() : null;
    price = price ? price.trim() : null;
    sale = sale ? sale.trim() : null;
    departure_schedule = departure_schedule ? departure_schedule.trim() : null;
    vehicle = vehicle ? vehicle.trim() : null;
    time = time ? time.trim() : null;
    tour_summary = tour_summary ? tour_summary.trim() : null;
    tour_program = tour_program ? tour_program.trim() : null;
    tour_policy = tour_policy ? tour_policy.trim() : null;
    terms_conditions = terms_conditions ? terms_conditions.trim() : null;
    trip = trip ? trip.trim() : null;
    guest_type = guest_type ? guest_type.toString() : null;
    try {
        const [result] = await pool.query(
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
                tour_name,
                tour_group,
                area,
                price,
                sale,
                departure_schedule,
                vehicle,
                time,
                tour_summary,
                tour_program,
                tour_policy,
                terms_conditions,
                trip,
                guest_type,
                Image,
                Thumbnail,
            ],
        );

        if (result.affectedRows > 0) {
            const folderName = `./src/public/images/tour/${result.insertId}`;
            // Create Folder
            handleCreateFolder(folderName);
            // Copy file
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
            // Callback
            return callback(true, `Create tour information successfully`, result.insertId);
        } else {
            return callback(false, `Create tour information failed`);
        }
    } catch (error) {
        console.error('Error create tour information in model', error);
        return callback(
            false,
            `Create tour information failed. A server-side problem occurred. Please come back later.`,
            error,
        );
    }
};

Tour.updateTour = async (req, callback) => {
    let { id } = req.params;
    try {
        const [result] = await pool.query(
            `
            SELECT * FROM \`tb_tour\`
            WHERE TourId =?
            `,
            [id],
        );
        if (result.length === 0) {
            if (req.files && req.files.thumbnail) {
                handleDeleteFile(req.files.thumbnail[0].path);
            }
            if (req.files && req.files.detailed_image) {
                req.files.detailed_image.forEach((image) => {
                    handleDeleteFile(image.path);
                });
            }
            return callback(false, `Tour information ID ${id} does not exist`);
        }
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
            Image,
            Thumbnail,
        } = result[0];
        if (req.files) {
            const { thumbnail, detailed_image } = req.files;
            Thumbnail = thumbnail ? thumbnail[0].filename : Thumbnail;
            Image = detailed_image ? detailed_image.map((image) => image.filename).toString() : Image;
            if (detailed_image && result[0].Image) {
                result[0].Image.split(',').forEach((image) => {
                    handleDeleteFile(`./src/public/images/tour/${id}/${image}`);
                });
            }
            if (thumbnail && result[0].Thumbnail) {
                handleDeleteFile(`./src/public/images/tour/${id}/${result[0].Thumbnail}`);
            }
        }
        let {
            tour_policy,
            terms_conditions,
            sale,
            tour_name,
            tour_summary,
            tour_program,
            trip,
            tour_group,
            area,
            price,
            departure_schedule,
            vehicle,
            time,
            guest_type,
        } = req.body;

        tour_name = tour_name ? tour_name.trim() : TourName;
        tour_group = tour_group ? tour_group.trim() : TourGroup;
        area = area ? area.trim() : Area;
        price = price ? price.trim() : Price;
        sale = sale ? sale.trim() : Sale;
        departure_schedule = departure_schedule ? departure_schedule.trim() : DepartureSchedule;
        vehicle = vehicle ? vehicle.trim() : Vehicle;
        time = time ? time.trim() : Time;
        tour_summary = tour_summary ? tour_summary.trim() : TourSummary;
        tour_program = tour_program ? tour_program.trim() : TourProgram;
        tour_policy = tour_policy ? tour_policy.trim() : TourPolicy;
        terms_conditions = terms_conditions ? terms_conditions.trim() : TermsConditions;
        trip = trip ? trip.trim() : Trip;
        guest_type = guest_type ? guest_type.toString() : GuestType;

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
                tour_name,
                tour_group,
                area,
                price,
                sale,
                departure_schedule,
                vehicle,
                time,
                tour_summary,
                tour_program,
                tour_policy,
                terms_conditions,
                trip,
                guest_type,
                Image,
                Thumbnail,
                id,
            ],
        );
        const folderName = `./src/public/images/tour/${id}`;
        handleCreateFolder(folderName);
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
        callback(true, `Update tour information ID ${id} successfully`, id);
    } catch (error) {
        console.error('Error update tour information in model', error);
        callback(
            false,
            `Update news information id ${id} failed. A server-side problem occurred. Please come back later.`,
            error,
        );
    }
};

Tour.deleteTour = async (id, callback) => {
    try {
        const [resultData] = await pool.query(
            `
                SELECT * FROM \`tb_tour\`
                WHERE TourId = ?
            `,
            [id],
        );

        if (resultData.length === 0) {
            return callback(false, `Tour information ID ${id} does not exist`);
        }
        const [result] = await pool.query(
            `
            DELETE FROM \`tb_tour\`
            WHERE TourId = ?
            `,
            [id],
        );
        if (result.affectedRows > 0) {
            // Delete folder
            handleDeleteFolder(`./src/public/images/tour/${id}`);
            // Callback
            return callback(true, `Delete tour information id ${id} successfully`, resultData[0]);
        } else {
            return callback(false, `Tour information ID ${id} does not exist`);
        }
    } catch (error) {
        console.error('Error delete tour information in model', error);
        callback(
            false,
            `Delete tour information id ${id} failed. A server-side problem occurred. Please come back later.`,
            error,
        );
    }
};
module.exports = Tour;
