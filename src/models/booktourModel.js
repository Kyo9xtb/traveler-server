const pool = require('../config/dbConfig');
const BookTour = {};

function BookTourFormat(data) {
    let results = [];
    data.forEach((item) => {
        let bookTour = {
            book_tour_id: item.BookTourId,
            user_id: item.UserId,
            user: item.user[0],
            full_name: item.FullName,
            email: item.Email,
            phone_number: item.PhoneNumber,
            address: item.Address,
            note: item.Note,
            total_price: item.TotalPrice,
            status: item.Status,
            create_at: item.CreateAt,
            update_at: item.UpdateAt,
            select_booking: item.tourBookingDetails,
        };
        results.push(bookTour);
    });
    return results;
}
async function BookingDetails(data) {
    const promise = data.map(async (item) => {
        let [resultTour] = await pool.query(
            `
                SELECT * FROM \`tb_tour\`
                WHERE TourId =?
            `,
            [item.TourId],
        );
        item.TourName = resultTour[0].TourName;
        item.Thumbnail = resultTour[0].Thumbnail
            ? `tour/${resultTour[0].TourId}/${resultTour[0].Thumbnail}`
            : 'default_thumbnail.png';
        return item;
    });
    const updateData = await Promise.all(promise);
    return updateData;
}
function TourFormatSelect(data) {
    let results = [];
    data.forEach((item) => {
        let tour = {
            booking_detail_id: item.BookTourDetailsId,
            tour_id: item.TourId,
            tour_name: item.TourName,
            price: item.Price,
            guest_type: item.GuestType,
            quantity: item.Quantity,
            departure_date: item.DepartureDate,
            thumbnail_url: `${process.env.HOSTNAME}/images/${item.Thumbnail}`,
        };
        results.push(tour);
    });
    return results;
}
function UserFormat(data) {
    let results = [];
    data.forEach((item) => {
        let user = {
            user_id: item.UserId,
            full_name: item.FullName,
            phone_number: item.PhoneNumber,
            address: item.Address,
            email: item.Email,
            avatar: item.Avatar ? `user_avatar/${item.UserId}/${item.Avatar}` : 'user_avatar/avatar-default.jpg',
        };
        user.avatar_url = `${process.env.HOSTNAME}/images/${user.avatar}`;
        results.push(user);
    });
    return results;
}

BookTour.getAllBookTour = async (callback) => {
    try {
        const [results] = await pool.query(
            `
                SELECT * FROM \`tb_book-tour\`
            `,
        );
        const promises = results.map(async (item) => {
            let [resultBooking] = await pool.query(
                `
                    SELECT * FROM \`tb_tour-booking-details\` 
                    WHERE BookTourId = ?
                `,
                [item.BookTourId],
            );
            let [resultUser] = await pool.query(
                `
                    SELECT * FROM \`tb_user\` 
                    WHERE UserId = ?
                `,
                [item.UserId],
            );
            item.user = UserFormat(resultUser);
            // item.tourBookingDetails1 = BookingDetailsFormat1(resultBooking);
            await BookingDetails(resultBooking).then((data) => {
                item.tourBookingDetails = TourFormatSelect(data);
            });
            return item;
        });
        const updatedResults = await Promise.all(promises);
        callback(true, 'Get information book tour successfully', BookTourFormat(updatedResults));
    } catch (error) {
        console.log(error);

        callback(false, 'Get information book tour failed');
    }
};
BookTour.getBookTourId = async (id, callback) => {
    try {
        const [result] = await pool.query(
            `
                SELECT * FROM \`tb_book-tour\`
                WHERE BookTourId = ?
            `,
            [id],
        );
        const promises = result.map(async (item) => {
            let [resultBooking] = await pool.query(
                `
                    SELECT * FROM \`tb_tour-booking-details\` 
                    WHERE BookTourId = ?
                `,
                [item.BookTourId],
            );
            let [resultUser] = await pool.query(
                `
                    SELECT * FROM \`tb_user\` 
                    WHERE UserId = ?
                `,
                [item.UserId],
            );
            item.user = UserFormat(resultUser);
            await BookingDetails(resultBooking).then((data) => {
                item.tourBookingDetails = TourFormatSelect(data);
            });
            return item;
        });
        const updatedResults = await Promise.all(promises);
        callback(true, 'Get information book tour successfully', BookTourFormat(updatedResults));
    } catch (error) {
        callback(false, 'Get information book tour failed', error);
    }
};
BookTour.createBookTour = async (req, callback) => {
    let { UserId, Email, FullName, PhoneNumber, Address, Note, TotalPrice, tourBookingDetails } = req.body;
    UserId = UserId ? UserId.trim() : null;
    Email = Email ? Email.trim() : null;
    FullName = FullName ? FullName.trim() : null;
    PhoneNumber = PhoneNumber ? PhoneNumber.trim() : null;
    Address = Address ? Address.trim() : null;
    Note = Note ? Note.trim() : null;
    TotalPrice = TotalPrice ? TotalPrice.trim() : null;
    if (Array.isArray(tourBookingDetails)) {
        try {
            let [result] = await pool.query(
                `
                    INSERT INTO \`tb_book-tour\` 
                        (
                            UserId,
                            Email,
                            FullName,
                            PhoneNumber,
                            Address,
                            Note,
                            TotalPrice
                        )
                    VALUES (?,?,?,?,?,?,?)`,
                [UserId, Email, FullName, PhoneNumber, Address, Note, TotalPrice],
            );
            tourBookingDetails.forEach(async (item) => {
                await pool.query(
                    `
                    INSERT INTO \`tb_tour-booking-details\` 
                        (
                            BookTourId,
                            TourId,
                            TourName,
                            Price,
                            Quantity,
                            GuestType,
                            DepartureDate
                        )
                    VALUES (?,?,?,?,?,?,?)`,
                    [
                        result.insertId,
                        item.TourId,
                        item.TourName,
                        item.Price,
                        item.Quantity,
                        item.GuestType,
                        item.DepartureDate,
                    ],
                );
            });
            callback(true, `Create book tour successfully`);
        } catch (error) {
            console.log(error);

            callback(false, `Create book tour failed`, error);
        }
    } else {
        callback(false, `Create book tour failed`);
    }
};

BookTour.updateBookTour = async (req, callback) => {
    let { id } = req.params;
    let { UserId, Email, FullName, PhoneNumber, Address, Note, TotalPrice, tourBookingDetails, Status } = req.body;
    UserId = UserId ? UserId.trim() : null;
    Email = Email ? Email.trim() : null;
    FullName = FullName ? FullName.trim() : null;
    PhoneNumber = PhoneNumber ? PhoneNumber.trim() : null;
    Address = Address ? Address.trim() : null;
    Note = Note ? Note.trim() : null;
    TotalPrice = TotalPrice ? TotalPrice.trim() : null;
    Status = Status ? Status.trim() : 'Pending';
    const [result] = await pool.query(
        `
            SELECT * FROM \`tb_book-tour\`
            WHERE BookTourId = ?
        `,
        [id],
    );
    if (result.length) {
        try {
            await pool.query(
                `
                    UPDATE  \`tb_book-tour\` SET
                        FullName = ?,
                        Email = ?,
                        PhoneNumber = ?,
                        Address = ?,
                        Note = ?,
                        TotalPrice = ?,
                        Status = ?
                    WHERE BookTourId = ?
                `,
                [FullName, Email, PhoneNumber, Address, Note, TotalPrice, Status, id],
            );
            tourBookingDetails.forEach(async (item) => {
                await pool.query(
                    `
                        UPDATE  \`tb_tour-booking-details\`  SET
                            TourId = ?,
                            TourName = ?,
                            Price = ?,
                            Quantity = ?,
                            GuestType = ?,
                            DepartureDate = ?
                        WHERE BookTourDetailsId = ?
                    `,
                    [
                        item.TourId,
                        item.TourName,
                        item.Price,
                        item.Quantity,
                        item.GuestType,
                        item.DepartureDate,
                        item.BookTourDetailsId,
                    ],
                );
            });
            callback(true, `Update tour booking information ID ${id} successfully`);
        } catch (error) {
            console.log(error);
            callback(false, `Update tour booking information ID ${id} failed`, error);
        }
    } else {
        callback(false, `Tour booking information ID ${id} does not exist`, error);
    }
};

BookTour.deleteBookTour = async (id, callback) => {
    try {
        await pool.query(
            `
            DELETE FROM \`tb_book-tour\` 
            WHERE BookTourId = ?`,
            [id],
        );
        callback(true, `Delete book tour ID ${id} successfully`);
    } catch (error) {
        callback(false, `Delete book tour ID ${id} failed`, error);
    }
};
module.exports = BookTour;
