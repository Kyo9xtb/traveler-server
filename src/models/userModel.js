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
        console.error('Error getting user information in model', error);
        callback(false, 'Get info users failed. A server-side problem occurred. Please come back later.', error);
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
        console.error('Error getting user information by id in model', error);
        callback(
            false,
            `Get customer ID ${id} information failed. A server-side problem occurred. Please come back later.`,
            error,
        );
    }
};

User.createUser = async (req, callback) => {
    let Avatar;
    if (req.file) {
        const avatar = req.file;
        Avatar = avatar ? avatar.filename : null;
    }
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
            [full_name, gender, birthday, phone_number, address, email, user_name, password, card_id, Avatar],
        );
        if (result.affectedRows > 0) {
            const folderName = `./src/public/images/user_avatar/${result.insertId}`;
            // Create new folder
            handleCreateFolder(folderName);
            // Copy file
            if (req.file) {
                const avatar = req.file;
                if (avatar) {
                    handleCopyFile(avatar.path, `${folderName}/${avatar.filename}`);
                }
            }
            // Callback
            callback(true, 'Add customer information successfully');
        } else {
            callback(false, `Add failed customer information`);
        }
    } catch (error) {
        console.error('Error creating user information in model', error);
        callback(
            false,
            `Add failed customer information. A server-side problem occurred. Please come back later.`,
            error,
        );
    }
};

User.updateUser = async (req, callback) => {
    let { id } = req.params;
    try {
        const [result] = await pool.query(
            `
            SELECT * FROM \`tb_user\`  
            WHERE UserID = ?
        `,
            [id],
        );

        if (result.length === 0) {
            if (req.files && req.files.avatar) {
                handleDeleteFile(req.files.avatar.path);
            }
            return callback(false, `Customer information ID ${id} does not exist`);
        }
        let { FullName, Gender, Birthday, PhoneNumber, Address, Email, UserName, CardId, Avatar, Status } = result[0];

        if (req.file) {
            const avatar = req.file;
            Avatar = avatar ? avatar.filename : Avatar;
            if (avatar && result[0].Avatar) {
                const folderName = `./src/public/images/user_avatar/${id}`;
                handleDeleteFile(`${folderName}/${result[0].Avatar}`);
            }
        }
        let { full_name, gender, birthday, phone_number, address, email, user_name, card_id, status } = req.body;

        full_name = full_name ? full_name.trim() : FullName;
        gender = gender ? gender.trim() : Gender;
        birthday = birthday ? birthday.trim() : Birthday;
        phone_number = phone_number ? phone_number.trim() : PhoneNumber;
        address = address ? address.trim() : Address;
        email = email ? email.trim() : Email;
        user_name = user_name ? user_name.trim() : UserName;
        card_id = card_id ? card_id.trim() : CardId;
        status = status ? status.trim() : Status;

        const [resultUpdate] = await pool.query(
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
            [full_name, gender, birthday, phone_number, address, email, user_name, card_id, status, Avatar, id],
        );
        if (resultUpdate.affectedRows === 0) {
            console.error(false, `User information update failed`);
            callback(false, 'User information update failed');
        } else {
            const folderName = `./src/public/images/user_avatar/${id}`;
            // create new folder for new avatar
            handleCreateFolder(folderName);
            // copy file
            if (req.file) {
                const avatar = req.file;
                handleCopyFile(avatar.path, `${folderName}/${avatar.filename}`);
            }
            callback(true, 'User information update successfully');
        }
    } catch (error) {
        console.error('Error updating user information in model:', error);
        callback(
            false,
            `Failed to update customer information ID ${id}. A server-side problem occurred. Please come back later.`,
        );
    }
};

User.deleteUser = async (id, callback) => {
    try {
        const [result] = await pool.query(
            `
                DELETE FROM \`tb_user\`  
                WHERE UserId = ?;
            `,
            [id],
        );
        if (result.affectedRows === 0) {
            return callback(false, `Customer information ID ${id} does not exist`);
        } else {
            // Delete folder
            handleDeleteFolder(`./src/public/images/user_avatar/${id}`);
            // Callback
            callback(true, `Delete customer information ID ${id} successful`);
        }
    } catch (error) {
        console.error('Error deleting user information in model', error);
        callback(
            false,
            `Delete customer information ID ${id} failed. A server-side problem occurred. Please come back later.`,
            error,
        );
    }
};

User.getUserLogin = async (req, callback) => {
    try {
        const { email, password } = req.body;
        const [result] = await pool.query(
            `
                SELECT * FROM \`tb_user\`
                WHERE Email = ? and Password = ?
            `,
            [email, password],
        );
        console.log(req.body);

        if (result.length > 0) {
            return callback(true, `Get information of successfully logged in users`, UserFormat(result)[0]);
        }
        return callback(false, `Get information of failed login users`, null);
    } catch (error) {
        console.error('Error getting user logion information in model', error);
        callback(
            false,
            'Get information of failed login users. A server-side problem occurred. Please come back later.',
            error,
        );
    }
};

User.getCheckEmail = async (email, callback) => {
    try {
        const [result] = await pool.query(
            `
                SELECT *  FROM \`tb_user\`
                WHERE Email = ?    
            `,
            [email],
        );
        if (result.length > 0) {
            return callback(true, `Email account already exists`);
        } else {
            return callback(false, `Email account does not exist`);
        }
    } catch (error) {
        console.error('Error checking email user information in model', error);
        callback(
            false,
            'Email information check failed. A server-side problem occurred. Please come back later.',
            error,
        );
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
        if (result.length > 0) {
            return callback(result[0]);
        }
        return callback(null);
    } catch (error) {
        console.error('Error getting session user information in model', error);
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
        console.error('Error creating session user information in model', error);
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
    } catch (error) {
        console.error('Error deleting session user information in model', error);
        callback(error);
    }
};

module.exports = User;
