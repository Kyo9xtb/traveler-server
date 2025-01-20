const pool = require('../config/dbConfig');

const StatisticalReport = {};

StatisticalReport.statisticalTour = async (callback) => {
    try {
        let [result] = await pool.query(`
            SELECT * FROM \`view_statistical_tour\`
        `);
        const dataFormat = (data) => {
            let results = [];
            data.forEach((item) => {
                let tour = {
                    tour_group: item.TourGroup,
                    area: item.Area,
                    total_tour: item.TotalTour,
                };
                results.push(tour);
            });
            return results;
        };
        callback(true, 'Get info statistical tour successfully', dataFormat(result));
    } catch (error) {
        console.error('Error StatisticalReport StatisticalTour in model:', error);
        callback(false, 'Get info statistical tour failed', error);
    }
};

StatisticalReport.revenueTour = async (callback) => {
    try {
        let [result] = await pool.query(`
            SELECT * FROM \`view_revenue_tour\`
        `);
        const dataFormat = (data) => {
            let results = [];
            data.forEach((item) => {
                let tour = {
                    status: item.Status,
                    total_tour: item.TotalTour,
                    total_price: item.TotalPrice,
                };
                results.push(tour);
            });
            return results;
        };
        callback(true, 'Get info revenue tour successfully', dataFormat(result));
    } catch (error) {
        console.error('Error StatisticalReport RevenueTour in model:', error);
        callback(false, 'Get info revenue tour failed', error);
    }
};
StatisticalReport.statisticalBookTour = async (callback) => {
    try {
        let [result] = await pool.query(`
            SELECT * FROM \`view_book_tour\`
        `);
        const dataFormat = (data) => {
            let results = [];
            data.forEach((item) => {
                let tour = {
                    tour_id: item.TourId,
                    tour_name: item.TourName,
                    total_bookings: item.TotalBookings,
                    total_quantity: +item.TotalQuantity,
                    status: item.Status,
                    total_price: item.TotalPrice,
                };
                results.push(tour);
            });
            return results;
        };
        callback(true, 'Get info revenue tour successfully', dataFormat(result));
    } catch (error) {
        console.error('Error StatisticalReport RevenueTour in model:', error);
        callback(false, 'Get info revenue tour failed', error);
    }
};

StatisticalReport.customerStatistics = async (callback) => {
    try {
        let [result] = await pool.query(`
            SELECT * FROM \`view_customer_statistics\`
        `);
        const dataFormat = (data) => {
            let results = [];
            data.forEach((item) => {
                let tour = {
                    year: item.Year,
                    month: item.Month,
                    status: item.Status,
                    guest_type: item.GuestType,
                    total: item.Total,
                };
                results.push(tour);
            });
            return results;
        };
        callback(true, 'Get info revenue tour successfully', dataFormat(result));
    } catch (error) {
        console.error('Error StatisticalReport RevenueTour in model:', error);
        callback(false, 'Get info revenue tour failed', error);
    }
};

StatisticalReport.monthlyStatistics = async (callback) => {
    try {
        let [result] = await pool.query(`
            SELECT * FROM \`view_MonthlyStatistics\`
        `);
        const dataFormat = (data) => {
            let results = [];
            data.forEach((item) => {
                let result = {
                    year: item.Year,
                    month: item.Month,
                    total_tour: item.TotalTours,
                    total_revenue: item.TotalRevenue,
                };
                results.push(result);
            });
            return results;
        };
        callback(true, 'Get info revenue tour successfully', dataFormat(result));
    } catch (error) {
        console.error('Error StatisticalReport RevenueTour in model:', error);
        callback(false, 'Get info revenue tour failed', error);
    }
};

StatisticalReport.userStatistics = async (callback) => {
    try {
        let [result] = await pool.query(`
            SELECT * FROM \`view_user_statistics\`
        `);
        const dataFormat = (data) => {
            let results = [];
            data.forEach((item) => {
                let result = {
                    year: item.Year,
                    month: item.Month,
                    status: item.Status,
                    total: item.Total,
                };
                results.push(result);
            });
            return results;
        };
        callback(true, 'Get info user statistics successfully', dataFormat(result));
    } catch (error) {
        console.error('Error StatisticalReport RevenueTour in model:', error);
        callback(false, 'Get info user statistics failed', error);
    }
};
module.exports = StatisticalReport;
