const pool = require('../config/dbConfig');
const {
    formatDatetime,
    handleCreateFolder,
    handleCopyFile,
    handleDeleteFile,
    handleDeleteFolder,
} = require('./handleModel');
const Admin = {};

function UserFormat(data) {
    let results = [];
    data.forEach((item) => {
        let user = {
            admin_id: item.AdminId,
            full_name: item.FullName,
            birthday: item.Birthday,
            phone_number: item.PhoneNumber,
            email: item.Email,
            avatar: item.Avatar ? `admin_avatar/${item.AdminId}/${item.Avatar}` : 'admin_avatar/avatar-default.jpg',
            department: item.Department,
            role: item.Role,
            created_at: item.CreatedAt,
            update_at: item.UpdateAt,
        };
        user.avatar_url = `${process.env.HOSTNAME}/images/${user.avatar}`;
        results.push(user);
    });
    return results;
}
Admin.getAdmin = async (id, callback) => {
    try {
        let [result] = await pool.query(
            `
            SELECT * FROM \`tb_admin\` 
        `,
            [id],
        );
        if (result.length > 0) {
            callback(true, `Get info staff successfully`, UserFormat(result));
        } else {
            callback(false, `Get info staff successfully`);
        }
    } catch (error) {
        console.error('Error getting info admin in admin model:', error);
        callback(false, `Get info staff failed`, error);
    }
};

Admin.getAdminById = async (id, callback) => {
    try {
        let [result] = await pool.query(
            `
            SELECT * FROM \`tb_admin\`  
            WHERE AdminId = ?
        `,
            [id],
        );
        if (result.length > 0) {
            callback(true, `Get staff ID ${id} information successfully`, UserFormat(result)[0]);
        } else {
            callback(false, `Get staff ID ${id} information does not exist`);
        }
    } catch (error) {
        console.error('Error getting admin by id in admin model:', error);
        callback(false, `Get staff ID ${id} information failed`, error);
    }
};

Admin.createAdmin = async (req, callback) => {
    try {
        let Avatar;
        if (req.file) {
            const avatar = req.file;
            Avatar = avatar ? avatar.filename : null;
        }
        let { full_name, gender, birthday, phone_number, email, password, department, role } = req.body;
        full_name = full_name ? full_name.trim() : null;
        gender = gender ? gender.trim() : null;
        birthday = birthday ? birthday.trim() : null;
        phone_number = phone_number ? phone_number.trim() : null;
        email = email ? email.trim() : null;
        password = password ? password.trim() : null;
        department = department ? department.trim() : null;
        role = role ? role.trim() : null;

        let [result] = await pool.query(
            `
                INSERT INTO \`tb_admin\` 
                    (
                        FullName,
                        Gender,
                        Birthday,
                        PhoneNumber,
                        Email,
                        Password,
                        Department,
                        Role,
                        Avatar
                    )
                VALUES (?,?,?,?,?,?,?,?,?);
            `,
            [full_name, gender, birthday, phone_number, email, password, department, role, Avatar],
        );
        if (result.affectedRows > 0) {
            const folderName = `./src/public/images/admin_avatar/${result.insertId}`;
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
        console.error('Error creating admin information in model', error);
        callback(false, `Add failed admin information. A server-side problem occurred. Please come back later.`, error);
    }
};

Admin.updateAdmin = async (req, callback) => {
    let { id } = req.params;
    try {
        const [result] = await pool.query(
            `
            SELECT * FROM \`tb_admin\`  
            WHERE AdminId = ?
        `,
            [id],
        );

        if (result.length === 0) {
            if (req.files && req.files.avatar) {
                handleDeleteFile(req.files.avatar.path);
            }
            return callback(false, `Admin information ID ${id} does not exist`);
        }
        let { FullName, Gender, Birthday, PhoneNumber, Email, Department, Role, Avatar, Password } = result[0];

        if (req.file) {
            const avatar = req.file;
            Avatar = avatar ? avatar.filename : Avatar;
            const folderName = `./src/public/images/admin_avatar/${id}`;
            if (avatar && result[0].Avatar) {
                handleDeleteFile(`${folderName}/${result[0].Avatar}`);
            }
        }
        let { full_name, gender, birthday, phone_number, email, password, department, role } = req.body;
        full_name = full_name ? full_name.trim() : FullName;
        gender = gender ? gender.trim() : Gender;
        birthday = birthday ? birthday.trim() : Birthday;
        phone_number = phone_number ? phone_number.trim() : PhoneNumber;
        email = email ? email.trim() : Email;
        password = password ? password.trim() : Password;
        department = department ? department.trim() : Department;
        role = role ? role.trim() : Role;

        const [resultUpdate] = await pool.query(
            `
                UPDATE \`tb_admin\` SET  
                    FullName = ?,
                    Gender = ?,
                    Birthday = ?,
                    PhoneNumber = ?,
                    Email = ?,
                    Password = ?,
                    Department = ?,
                    Role = ?,
                    Avatar = ? 
                WHERE AdminId = ?;
            `,
            [full_name, gender, birthday, phone_number, email, password, department, role, Avatar, id],
        );
        if (resultUpdate.affectedRows === 0) {
            console.error(false, `Admin information update failed`);
            callback(false, 'Admin information update failed');
        } else {
            const folderName = `./src/public/images/admin_avatar/${id}`;
            // create new folder for new avatar
            handleCreateFolder(folderName);
            // copy file
            if (req.file) {
                const avatar = req.file;
                handleCopyFile(avatar.path, `${folderName}/${avatar.filename}`);
            }
            callback(true, 'admin information update successfully');
        }
    } catch (error) {
        console.error('Error updating admin information in model:', error);
        callback(
            false,
            `Failed to update admin information ID ${id}. A server-side problem occurred. Please come back later.`,
        );
    }
};
Admin.deleteAdmin = async (id, callback) => {
    try {
        const [result] = await pool.query(
            `
                DELETE FROM \`tb_admin\`  
                WHERE AdminId = ?;
            `,
            [id],
        );
        if (result.affectedRows === 0) {
            return callback(false, `Admin information ID ${id} does not exist`);
        } else {
            // Delete folder
            handleDeleteFolder(`./src/public/images/admin_avatar/${id}`);
            // Callback
            callback(true, `Delete admin information ID ${id} successful`);
        }
    } catch (error) {
        console.error('Error deleting admin information in model', error);
        callback(
            false,
            `Delete admin information ID ${id} failed. A server-side problem occurred. Please come back later.`,
            error,
        );
    }
};

Admin.getLogin = async (req, callback) => {
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
        console.error('Error getting admin login in admin model:', error);
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
        console.error('Error getting admin session in admin model:', error);
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
        console.error('Error creating session in admin model:', error);
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
        console.error('Error deleting session in admin model:', error);
        callback(error);
    }
};

Admin.getCheckEmail = async (email, callback) => {
    try {
        const [result] = await pool.query(
            `
                SELECT * FROM \`tb_admin\`
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
module.exports = Admin;
