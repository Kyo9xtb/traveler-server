const pool = require('../config/dbConfig');
const Cart = {};
function DataFormat(data) {
    return data.map((item) => {
        let cartContent;
        try {
            cartContent = item.ContentCart ? JSON.parse(item.ContentCart) : null;
        } catch (error) {
            cartContent = null;
        }

        return {
            cart_id: item.CartId,
            user_id: item.UserId,
            cart: cartContent,
            created_at: item.CreatedAt,
            update_at: item.UpdateAt,
        };
    });
}

Cart.getCart = async (callback) => {
    try {
        let [results] = await pool.query(
            `
            SELECT * FROM \`tb_cart\`
            `,
        );
        callback(true, 'Get all cart information successfully', DataFormat(results));
    } catch (error) {
        console.error('Error getting cart information in model', error);
        callback(false, 'Get all cart information failed', error);
    }
};

Cart.getCartById = async (id, callback) => {
    try {
        let [result] = await pool.query(
            `
                SELECT * FROM \`tb_cart\`
                WHERE CartId = ?
            `,
            [id],
        );
        if (result.length) {
            callback(true, `Get cart id ${id} successfully`, DataFormat(result)[0]);
        } else {
            callback(false, `cart information id ${id} does not exist`);
        }
    } catch (error) {
        console.error('Error getting cart information by id in model', error);
        callback(false, `Get cart information id ${id} failed`, error);
    }
};
Cart.getCartByUserId = async (id, callback) => {
    try {
        let [result] = await pool.query(
            `
                SELECT * FROM \`tb_cart\`
                WHERE UserId =?
            `,
            [id],
        );
        if (result.length) {
            callback(true, `Get cart user id ${id} successfully`, DataFormat(result)[0]);
        } else {
            callback(false, `Cart information user id ${id} does not exist`, []);
        }
    } catch (error) {
        console.error('Error getting cart information by user id in model', error);
        callback(false, `Get cart information user id ${id} failed`, error);
    }
};
Cart.createCart = async (req, callback) => {
    try {
        let { cart, user_id } = req.body;
        cart = cart ? cart.toString().trim() : null;
        user_id = user_id ? user_id.toString().trim() : null;

        Cart.getCartByUserId(user_id, async (status) => {
            if (!status) {
                let [result] = await pool.query(
                    `
                    INSERT INTO \`tb_cart\` (UserId, ContentCart)
                    VALUES (?,?)
                    `,
                    [user_id, cart],
                );
                if (result.insertId) {
                    return callback(true, 'Create tour successfully');
                } else {
                    return callback(false, 'Create tour failed');
                }
            } else {
                return callback(false, `Cart user id ${user_id} already exists`);
            }
        });
    } catch (error) {
        console.error('Error creating cart in model', error);
        callback(false, 'Create tour failed', error);
    }
};

Cart.updateCart = async (req, callback) => {
    try {
        let { cart, user_id } = req.body;
        let { id } = req.params;
        cart = cart ? JSON.stringify(cart) : null;
        user_id = user_id ? user_id.toString().trim() : null;
        let [result] = await pool.query(
            `
                UPDATE  \`tb_cart\` SET UserId = ? , ContentCart = ?  WHERE CartId = ?
            `,
            [user_id, cart, id],
        );
        if (result.affectedRows) {
            return callback(true, 'Update cart successfully');
        } else {
            return callback(false, 'Update cart failed');
        }
    } catch (error) {
        console.error('Error updating cart in model', error);
        callback(false, 'Update cart failed', error);
    }
};

Cart.deleteCart = async (id, callback) => {
    try {
        const [result, fields] = await pool.query(
            `
            DELETE FROM \`tb_cart\`
            WHERE CartId =?
            `,
            [id],
        );
        if (result.affectedRows > 0) {
            callback(true, `Delete cart information id ${id} successfully`);
        } else {
            callback(false, `Delete cart information id ${id} failed`);
        }
    } catch (error) {
        console.error('Error delete cart information in model', error);
        callback(false, `Delete cart information id ${id} failed`, error);
    }
};
module.exports = Cart;
