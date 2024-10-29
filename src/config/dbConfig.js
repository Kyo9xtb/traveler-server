const mysql = require('mysql2/promise');
require('dotenv').config();

//create a connection to the database
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'DB_SaoVietTravel',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    multipleStatements: true,
});
pool.getConnection((err, conn) => {
    console.log('err', conn);

    if (err) {
        console.log(' ====>>>> Database Connection Failed !!!  ==>', err.sqlMessage);
    } else {
        console.log('Connected to Database');
    }
});

// pool.end();
module.exports = pool;
