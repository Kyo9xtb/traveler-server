const pool = require('../config/dbConfig');
const { formatDatetime } = require('./handleModel');
const Admin = {};

function UserFormat(data) {
    let results = [];
    data.forEach((item) => {
        let user = {
            admin_id: item.AdminId,
            full_name: item.FullName,
            email: item.Email,
            avatar: item.Avatar ? `user_avatar/${item.UserId}/${item.Avatar}` : 'user_avatar/avatar-default.jpg',
            department: item.Department,
            created_at: item.CreatedAt,
            update_at: item.UpdateAt,
        };
        user.avatar_url = `${process.env.HOSTNAME}/images/${user.avatar}`;
        results.push(user);
    });
    return results;
}

Admin.getAdminById = async (id, callback) => {
    try {
        let [result] = await pool.query(
            `
            SELECT AdminId, FullName, Email FROM \`tb_admin\`  
            WHERE AdminId = ?
        `,
            [id],
        );
        if (result.length) {
            callback(true, `Get customer ID ${id} information successfully`, UserFormat(result)[0]);
        } else {
            callback(false, `Get customer ID ${id} information does not exist`);
        }
    } catch (error) {
        callback(false, `Get customer ID ${id} information failed`, error);
    }
};

Admin.get = async (req, callback) => {
    try {
        const { email, password } = req.body;
        const [result] = await pool.query(
            `
            SELECT * FROM \`tb_admin\`
            WHERE Email = ? and Password = ?
        `,
            [email, password],
        );
        if (result.length > 0) {
            return callback(UserFormat(result)[0]);
        }
        return callback(null);
    } catch (error) {
        callback(error);
    }
};

Admin.getSession = async (SessionId, callback) => {
    try {
        const [result] = await pool.query(
            `
            SELECT * FROM \`tb_session-admin\`
            WHERE SessionId = ?
        `,
            [SessionId],
        );
        if (result.length > 0) {
            return callback(result[0]);
        }
        return callback(null);
    } catch (error) {
        console.log('error', error);

        callback(error);
    }
};
Admin.createSession = async (data, callback) => {
    try {
        const { sessionID, adminId, createAt, expiresAt } = data;
        const [result] = await pool.query(
            `
            INSERT INTO \`tb_session-admin\` 
                (
                    SessionId, 
                    AdminId, 
                    CreatedAt,
                    ExpiresAt
                ) 
            VALUES (?,?,?,?) 
        `,
            [sessionID, adminId, formatDatetime(createAt), formatDatetime(expiresAt)],
        );
        if (result.affectedRows) {
            return callback(true);
        }
        return callback(false);
    } catch (error) {
        callback(error);
    }
};
Admin.deleteSession = async (sessionID) => {
    try {
        await pool.query(
            `
            DELETE FROM \`tb_session-admin\`
            WHERE SessionId = ?
            `,
            [sessionID],
        );
    } catch (error) {
        callback(error);
    }
};
module.exports = Admin;
