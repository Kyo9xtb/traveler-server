const pool = require('../config/dbConfig');
const { handlerCopyFile, handelrCreateFolder, handlerDeleteFile, handelrDeleteFolder } = require('./handlerModel');
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
            avatar: item.Avatar ? `user_avatar/${item.UserId}/${item.Avatar}` : 'user_avatar/avatar-default.jpg',
            create_at: item.CreateAt,
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
            callback(true, `Get customer ID ${id} information successfully`, UserFormat(result));
        } else {
            callback(false, `Get customer ID ${id} information does not exist`);
        }
    } catch (error) {
        callback(false, `Get customer ID ${id} information failed`, error);
    }
};

User.createUser = async (req, callback) => {
    let avatar = req.file;
    let { FullName, Gender, Birthday, PhoneNumber, Address, Email, UserName, Password, ID_Card } = req.body;
    FullName = FullName ? FullName.trim() : null;
    Gender = Gender ? Gender.trim() : null;
    Birthday = Birthday ? Birthday.trim() : null;
    PhoneNumber = PhoneNumber ? PhoneNumber.trim() : null;
    Address = Address ? Address.trim() : null;
    Email = Email ? Email.trim() : null;
    UserName = UserName ? UserName.trim() : null;
    Password = Password ? Password.trim() : null;
    ID_Card = ID_Card ? ID_Card.trim() : null;
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
            [FullName, Gender, Birthday, PhoneNumber, Address, Email, UserName, Password, ID_Card, avatar.filename],
        );
        const folderName = `./src/public/images/user_avatar/${result.insertId}`;
        // Create new folder
        handelrCreateFolder(folderName);
        // Copy file
        if (avatar) {
            handlerCopyFile(avatar.path, `${folderName}/${avatar.filename}`);
        }
        // Callback
        callback(true, 'Add customer information successfully');
    } catch (error) {
        callback(false, `Add failed customer information`, error);
    }
};

User.updateUser = async (req, callback) => {
    let avatar = req.file;
    let { id } = req.params;
    let { FullName, Gender, Birthday, PhoneNumber, Address, Email, UserName, Password, ID_Card } = req.body;
    FullName = FullName ? FullName.trim() : null;
    Gender = Gender ? Gender.trim() : null;
    Birthday = Birthday ? Birthday.trim() : null;
    PhoneNumber = PhoneNumber ? PhoneNumber.trim() : null;
    Address = Address ? Address.trim() : null;
    Email = Email ? Email.trim() : null;
    UserName = UserName ? UserName.trim() : null;
    Password = Password ? Password.trim() : null;
    ID_Card = ID_Card ? ID_Card.trim() : null;
    let [result] = await pool.query(
        `
        SELECT * FROM \`tb_user\`  
        WHERE UserID = ?
    `,
        [id],
    );
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
                        Password = ?,
                        CardId = ?,
                        Avatar = ? 
                    WHERE UserId = ?;
                `,
                    [
                        FullName,
                        Gender,
                        Birthday,
                        PhoneNumber,
                        Address,
                        Email,
                        UserName,
                        Password,
                        ID_Card,
                        avatar.filename,
                        id,
                    ],
                );
                const folderName = `./src/public/images/user_avatar/${id}`;
                // create new folder for new avatar
                handelrCreateFolder(folderName);
                // copy file
                handlerCopyFile(avatar.path, `${folderName}/${avatar.filename}`);
                // delete old file
                if (result[0].Avatar) {
                    handlerDeleteFile(`${folderName}/${result[0].Avatar}`);
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
                        Password = ?,
                        CardId = ? 
                    WHERE UserId = ?;
                `,
                    [FullName, Gender, Birthday, PhoneNumber, Address, Email, UserName, Password, ID_Card, id],
                );
            }
            callback(true, `Update customer information ID ${id} successful`);
        } catch (error) {
            console.error('Error updating user information:', error);
            callback(false, `Failed to update customer information ID ${id}`);
        }
    } else {
        if (avatar) {
            handlerDeleteFile(avatar.path);
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
        handelrDeleteFolder(`./src/public/images/user_avatar/${id}`);
        // Callback
        callback(true, `Delete customer information ID ${id} successful`);
    } catch (error) {
        callback(false, `Delete customer information ID ${id} failed`, error);
    }
};
module.exports = User;
