// const mysql = require("mysql2/promise");
// require("dotenv").config();

// //create a connection to the database
// const mySqlDB = mysql.createPool({
//   host: process.env.DB_HOST || "localhost",
//   port: process.env.DB_PORT || 3306,
//   user: process.env.DB_USER || "root",
//   password: process.env.DB_PASSWORD || "",
//   database: process.env.DB_NAME || "database_ecommerce",
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0,
//   multipleStatements: true,
// });
// mySqlDB.getConnection((err, conn) => {
//   console.log("tesst");

//   if (err) {
//     console.log(
//       " ====>>>> Database Connection Failed !!!  ==>",
//       err.sqlMessage
//     );
//   } else {
//     console.log("Connected to Database");
//   }
// });

// let brand = [
//   "adata",
//   "apacer",
//   "corsair",
//   "gskill",
//   "kingston",
//   "lexar",
//   "pny",
// ];
// brand.forEach((item) => {
//   console.log(item);
//   let sql = `
//   CREATE VIEW view_${item}_ram_products AS SELECT products.id_product,concat('RAAD',RIGHT(concat('0000', CAST(${item}_ram_product_details.id as varchar(5))),4)) AS  product_code,product_name, brand, type, market_price, sale, image,
// type_ram, line, part_code, capacity, ram_standard, speed, latency, voltage, ecc, pack, color, heat_sink, led_color, detailed_image, last_update
// FROM products, ${item}_ram_product_details
// WHERE products.link_code = ${item}_ram_product_details.link_code;
//   `;
//   mySqlDB.query(sql);
// });

// // mySqlDB.end();
// module.exports = mySqlDB;
