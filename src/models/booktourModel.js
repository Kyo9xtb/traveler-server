const pool = require('../config/dbConfig');
const { formatDatetime } = require('./handleModel');
const BookTour = {};

function BookTourFormat(data) {
    let results = [];
    data.forEach((item) => {
        let bookTour = {
            book_tour_id: item.BookTourId,
            user_id: item.UserId,
            cancellation_reason: item.CancellationReason,
            full_name: item.FullName,
            email: item.Email,
            phone_number: item.PhoneNumber,
            address: item.Address,
            note: item.Note,
            total_price: item.TotalPrice,
            cash_payment: item.CashPayment,
            transfer_payment: item.TransferPayment,
            paid_amount: +item.CashPayment + +item.TransferPayment,
            amount_remaining: +item.TotalPrice - (+item.CashPayment + +item.TransferPayment),
            status: item.Status,
            created_at: item.CreatedAt,
            update_at: item.UpdateAt,
            payment_method: item.PaymentMethod,
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

BookTour.getAllBookTour = async (callback) => {
    try {
        const [results] = await pool.query(
            `
                SELECT * FROM \`tb_book-tour\`
            `,
        );
        const promises = results.map(async (item) => {
            try {
                const [resultBooking] = await pool.query(
                    `
                        SELECT * FROM \`tb_tour-booking-details\`
                        WHERE BookTourId = ?
                    `,
                    [item.BookTourId],
                );
                const data = await BookingDetails(resultBooking);
                item.tourBookingDetails = TourFormatSelect(data);
            } catch (error) {
                throw error;
            }
            return item;
        });
        const updatedResults = await Promise.all(promises);
        return callback(true, 'Get information book tour successfully', BookTourFormat(updatedResults));
    } catch (error) {
        console.error('Error getting information book tour in book tour model.', error);
        return callback(
            false,
            'Get information book tour failed. A server-side problem occurred. Please come back later.',
            error,
        );
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
            try {
                const [resultBooking] = await pool.query(
                    `
                        SELECT * FROM \`tb_tour-booking-details\`
                        WHERE BookTourId = ?
                    `,
                    [item.BookTourId],
                );
                const data = await BookingDetails(resultBooking);
                item.tourBookingDetails = TourFormatSelect(data);
            } catch (error) {
                throw error;
            }
            return item;
        });
        const updatedResults = await Promise.all(promises);
        if (updatedResults.length > 0) {
            return callback(true, `Get information book tour id ${id} successfully`, BookTourFormat(updatedResults)[0]);
        } else {
            return callback(true, `Get information book tour id ${id} does not exist`);
        }
    } catch (error) {
        console.error('Error getting information book tour by id in book tour model', error);
        return callback(
            false,
            `Get information book tour id ${id} failed.A error is occurring on the server side, please come back later.`,
            error,
        );
    }
};
BookTour.createBookTour = async (req, callback) => {
    let { user_id, email, phone_number, full_name, address, note, total_price, select_booking, payment_method } =
        req.body;
    user_id = user_id ? user_id.toString().trim() : null;
    full_name = full_name ? full_name.toString().trim() : null;
    email = email ? email.toString().trim() : null;
    phone_number = phone_number ? phone_number.toString().trim() : null;
    address = address ? address.toString().trim() : null;
    note = note ? note.toString().trim() : null;
    payment_method = payment_method ? payment_method.toString().trim() : null;
    total_price = total_price ? total_price.toString().trim() : null;
    if (Array.isArray(select_booking)) {
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
                            TotalPrice,
                            PaymentMethod
                        )
                    VALUES (?,?,?,?,?,?,?,?)`,
                [user_id, email, full_name, phone_number, address, note, total_price, payment_method],
            );
            const promises = select_booking.map(async (item) => {
                const { departure_date } = item;
                const formattedDepartureDate = departure_date
                    ? formatDatetime(item.departure_date.split('/').reverse().join('-'))
                    : null;
                try {
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
                            item.tour_id,
                            item.tour_name,
                            item.price,
                            item.quantity,
                            item.customer_type,
                            formattedDepartureDate,
                        ],
                    );
                } catch (error) {
                    console.log('error creating tour', error);
                    throw error;
                }
            });
            console.log(promises);

            await Promise.all(promises);

            callback(true, `Create book tour successfully`);
        } catch (error) {
            console.error('Error creating information book tour by id in book tour model', error);
            return callback(
                false,
                `Create book tour failed. A server-side problem occurred. Please come back later.`,
                error,
            );
        }
    } else {
        return callback(false, `Create book tour failed******`);
    }
};

BookTour.updateBookTour = async (req, callback) => {
    let { id } = req.params;
    try {
        const [result] = await pool.query(
            `
                SELECT * FROM \`tb_book-tour\`
                WHERE BookTourId = ? 
            `,
            [id],
        );
        if (result.length === 0) {
            return callback(false, `Update tour booking information ID ${id} does not exist`);
        }
        console.log(result[0]);

        const {
            UserId,
            FullName,
            Email,
            PhoneNumber,
            Address,
            Note,
            TotalPrice,
            CashPayment,
            TransferPayment,
            Status,
            PaymentMethod,
            CancellationReason,
        } = result[0];

        let {
            user_id,
            email,
            phone_number,
            full_name,
            address,
            note,
            total_price,
            cash_payment,
            transfer_payment,
            select_booking,
            payment_method,
            status,
            cancellation_reason,
        } = req.body;
        user_id = user_id ? user_id.toString().trim() : UserId;
        email = email ? email.toString().trim() : Email;
        full_name = full_name ? full_name.toString().trim() : FullName;
        phone_number = phone_number ? phone_number.toString().trim() : PhoneNumber;
        address = address ? address.toString().trim() : Address;
        note = note ? note.toString().trim() : Note;
        total_price = total_price ? total_price.toString().trim() : TotalPrice;
        cash_payment = cash_payment ? cash_payment.toString().trim() : CashPayment;
        transfer_payment = transfer_payment ? transfer_payment.toString().trim() : TransferPayment;
        payment_method = payment_method ? payment_method.toString().trim() : PaymentMethod;
        cancellation_reason = cancellation_reason ? cancellation_reason.toString().trim() : CancellationReason;
        status = status ? status.toString().trim() : Status;

        await pool.query(
            `
                UPDATE  \`tb_book-tour\` SET
                    FullName = ?,
                    Email = ?,
                    PhoneNumber = ?,
                    Address = ?,
                    Note = ?,
                    TotalPrice = ?,
                    CashPayment = ?,
                    TransferPayment = ?,
                    Status = ?,
                    PaymentMethod = ?,
                    CancellationReason = ?
                WHERE BookTourId = ?
            `,
            [
                full_name,
                email,
                phone_number,
                address,
                note,
                total_price,
                cash_payment,
                transfer_payment,
                status,
                payment_method,
                cancellation_reason,
                id,
            ],
        );
        const promise = select_booking.map(async (item) => {
            try {
                await pool.query(
                    `
                        UPDATE  \`tb_tour-booking-details\`  SET
                            TourId = ?,
                            TourName = ?,
                            Price = ?,
                            Quantity = ?,
                            GuestType = ?,
                            DepartureDate = ?,
                            Status = ?
                        WHERE BookTourDetailsId = ?
                    `,
                    [
                        item.tour_id,
                        item.tour_name,
                        item.price,
                        item.quantity,
                        item.guest_type,
                        formatDatetime(item.departure_date),
                        status,
                        item.booking_detail_id,
                    ],
                );
            } catch (error) {
                throw error;
            }
        });
        await Promise.all(promise);
        return callback(true, `Update tour booking information ID ${id} successfully`);
    } catch (error) {
        console.error('Error updating information book tour by id in book tour model', error);
        return callback(
            false,
            `Update tour booking information ID ${id} failed. A server-side problem occurred. Please come back later.`,
            error,
        );
    }
};

BookTour.deleteBookTour = async (id, callback) => {
    try {
        const [result] = await pool.query(
            `
            DELETE FROM \`tb_book-tour\` 
            WHERE BookTourId = ?`,
            [id],
        );
        if (result.affectedRows > 0) {
            return callback(true, `Delete book tour ID ${id} successfully`);
        } else {
            return callback(false, `Delete book tour ID ${id} failed`);
        }
    } catch (error) {
        console.error('Error deleting information book tour by id in book tour model', error);
        return callback(
            false,
            `Delete book tour ID ${id} failed. A server-side problem occurred. Please come back later.`,
            error,
        );
    }
};
module.exports = BookTour;
