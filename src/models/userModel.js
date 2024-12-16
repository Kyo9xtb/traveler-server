const pool = require('../config/dbConfig');
const {
    handleCopyFile,
    handleCreateFolder,
    handleDeleteFolder,
    handleDeleteFile,
    formatDatetime,
} = require('./handleModel');
const User = {};
function UserFormat(data) {
    let results = [];
    data.forEach((item) => {
        let user = {
            user_id: item.UserId,
            full_name: item.FullName,
            gender: item.Gender,
            birthday: item.Birthday,
            phone_number: item.PhoneNumber,
            address: item.Address,
            email: item.Email,
            user_name: item.UserName,
            card_id: item.CardId,
            status: item.Status,
            avatar: item.Avatar ? `user_avatar/${item.UserId}/${item.Avatar}` : 'user_avatar/avatar-default.jpg',
            created_at: item.CreatedAt,
            update_at: item.UpdateAt,
        };
        user.avatar_url = `${process.env.HOSTNAME}/images/${user.avatar}`;
        results.push(user);
    });
    return results;
}

User.getUsers = async (callback) => {
    try {
        let [result] = await pool.query(`
            SELECT * FROM \`tb_user\`    
        `);

        callback(true, 'Get info users successfully', UserFormat(result));
    } catch (error) {
        callback(false, 'Get info users failed', error);
    }
};

User.getUsersById = async (id, callback) => {
    try {
        let [result] = await pool.query(
            `
            SELECT * FROM \`tb_user\`  
            WHERE UserID = ?
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
User.getUser = async (req, callback) => {
    try {
        const { Email, Password } = req.body;
        const [result] = await pool.query(
            `
            SELECT * FROM \`tb_user\`
            WHERE Email = ? and Password = ?
        `,
            [Email, Password],
        );
        if (result.length > 0) {
            return callback(UserFormat(result)[0]);
        }
        return callback(null);
    } catch (error) {
        callback(error);
    }
};
User.createUser = async (req, callback) => {
    let avatar = req.file;
    let { full_name, gender, birthday, phone_number, address, email, password, user_name, card_id, status } = req.body;
    full_name = full_name ? full_name.trim() : null;
    gender = gender ? gender.trim() : null;
    birthday = birthday ? birthday.trim() : null;
    phone_number = phone_number ? phone_number.trim() : null;
    address = address ? address.trim() : null;
    email = email ? email.trim() : null;
    password = password ? password.trim() : null;
    user_name = user_name ? user_name.trim() : null;
    card_id = card_id ? card_id.trim() : null;
    status = status ? status.trim() : null;
    avatar = avatar ? avatar.filename : null;
    console.log('req.body', req.body);

    try {
        let [result] = await pool.query(
            `
                INSERT INTO \`tb_user\` 
                    (
                        FullName,
                        Gender,
                        Birthday,
                        PhoneNumber,
                        Address,
                        Email,
                        UserName,
                        Password,
                        CardId,
                        Avatar
                    )
                VALUES (?,?,?,?,?,?,?,?,?,?);
            `,
            [full_name, gender, birthday, phone_number, address, email, user_name, password, card_id, avatar],
        );
        const folderName = `./src/public/images/user_avatar/${result.insertId}`;
        // Create new folder
        handleCreateFolder(folderName);
        // Copy file
        if (avatar) {
            handleCopyFile(avatar.path, `${folderName}/${avatar.filename}`);
        }
        // Callback
        callback(true, 'Add customer information successfully');
    } catch (error) {
        console.log(error);

        callback(false, `Add failed customer information`, error);
    }
};

User.updateUser = async (req, callback) => {
    let avatar = req.file;
    let { id } = req.params;
    let { full_name, gender, birthday, phone_number, address, email, user_name, card_id, status } = req.body;
    let [result] = await pool.query(
        `
        SELECT * FROM \`tb_user\`  
        WHERE UserID = ?
    `,
        [id],
    );
    full_name = full_name ? full_name.trim() : null;
    gender = gender ? gender.trim() : null;
    birthday = birthday ? birthday.trim() : null;
    phone_number = phone_number ? phone_number.trim() : null;
    address = address ? address.trim() : null;
    email = email ? email.trim() : null;
    user_name = user_name ? user_name.trim() : null;
    card_id = card_id ? card_id.trim() : null;
    status = status ? status.trim() : null;
    avatar = avatar ? avatar.filename : result[0].Avatar;
    console.log('req.body', req.body);

    if (result.length) {
        try {
            if (avatar) {
                let [result] = await pool.query(
                    `
                SELECT * FROM \`tb_user\`
                WHERE UserID = ?
            `,
                    [id],
                );
                await pool.query(
                    `
                    UPDATE \`tb_user\` SET  
                        FullName = ?,
                        Gender = ?,
                        Birthday = ?,
                        PhoneNumber = ?,
                        Address = ?,
                        Email = ?,
                        UserName = ?,
                        CardId = ?,
                        Status = ?,
                        Avatar = ? 
                    WHERE UserId = ?;
                `,
                    [full_name, gender, birthday, phone_number, address, email, user_name, card_id, status, avatar, id],
                );
                const folderName = `./src/public/images/user_avatar/${id}`;
                // create new folder for new avatar
                handleCreateFolder(folderName);
                // copy file
                handleCopyFile(avatar.path, `${folderName}/${avatar.filename}`);
                // delete old file
                if (result[0].Avatar) {
                    handleDeleteFile(`${folderName}/${result[0].Avatar}`);
                }
            } else {
                await pool.query(
                    `
                    UPDATE \`tb_user\` SET  
                        FullName = ?,
                        Gender = ?,
                        Birthday = ?,
                        PhoneNumber = ?,
                        Address = ?,
                        Email = ?,
                        UserName = ?,
                        CardId = ? ,
                        Status = ?
                    WHERE UserId = ?;
                `,
                    [full_name, gender, birthday, phone_number, address, email, user_name, card_id, status, id],
                );
            }
            callback(true, `Update customer information ID ${id} successful`);
        } catch (error) {
            console.error('Error updating user information:', error);
            callback(false, `Failed to update customer information ID ${id}`);
        }
    } else {
        if (avatar) {
            handleDeleteFile(avatar.path);
        }
        callback(false, `Customer information ID ${id} does not exist`);
    }
};

User.deleteUser = async (id, callback) => {
    try {
        await pool.query(
            `
            DELETE FROM \`tb_user\`  
            WHERE UserId = ?;
        `,
            [id],
        );
        // Delete folder
        handleDeleteFolder(`./src/public/images/user_avatar/${id}`);
        // Callback
        callback(true, `Delete customer information ID ${id} successful`);
    } catch (error) {
        callback(false, `Delete customer information ID ${id} failed`, error);
    }
};

User.getCheckEmail = async (email, callback) => {
    try {
        let [result] = await pool.query(
            `
            SELECT *  FROM \`tb_user\`
            WHERE Email = ?    
        `,
            [email],
        );
        if (result.length > 0) {
            return callback(true);
        } else {
            return callback(false);
        }
    } catch (error) {
        callback(false, 'Get info users failed', error);
    }
};

User.getSession = async (SessionId, callback) => {
    try {
        const [result] = await pool.query(
            `
            SELECT * FROM \`tb_session-user\`
            WHERE SessionId = ?
        `,
            [SessionId],
        );
        console.log('sessionID', SessionId);
        console.log("result", result);
        
        if (result.length > 0) {
            return callback(result[0]);
        }
        return callback(null);
    } catch (error) {
        console.log(error);
        
        callback(error);
    }
};

User.createSession = async (data, callback) => {
    try {
        const { sessionID, userId, createAt, expiresAt } = data;
        const [result] = await pool.query(
            `
            INSERT INTO \`tb_session-user\` 
                (
                    SessionId, 
                    UserId, 
                    CreatedAt,
                    ExpiresAt
                ) 
            VALUES (?,?,?,?) 
        `,
            [sessionID, userId, formatDatetime(createAt), formatDatetime(expiresAt)],
        );
        if (result.affectedRows) {
            return callback(true);
        }
        return callback(false);
    } catch (error) {
        console.log(error);
        
        callback(error);
    }
};

User.deleteSession = async (sessionID) => {
    try {
        await pool.query(
            `
            DELETE FROM \`tb_session-user\`
            WHERE SessionId = ?
            `,
            [sessionID],
        );
        // console.log(sessionID);
    } catch (error) {
        callback(error);
    }
};

module.exports = User;
