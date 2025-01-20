const pool = require('../config/dbConfig');

const Contact = {};

function DataFormat(data) {
    let results = [];
    data.forEach((item) => {
        let contact = {
            contact_id: item.ContactId,
            full_name: item.FullName,
            phone_number: item.PhoneNumber,
            email: item.Email,
            content: item.Content,
            contact_results: item.ContactResults,
            status: item.Status,
            created_at: item.CreatedAt,
            update_at: item.UpdateAt,
        };
        results.push(contact);
    });
    return results;
}
Contact.getContacts = async (callback) => {
    try {
        const [result] = await pool.query(`
            SELECT * FROM \`tb_contact\`
        `);
        if (result.length > 0) {
            return callback(true, 'Get info contact successfully', DataFormat(result));
        } else {
            return callback(true, 'No contact information found');
        }
    } catch (error) {
        console.error('Error getting contact in contact model:', error);
        return callback(
            false,
            'Get info contact failed. A server-side problem occurred. Please come back later.',
            error,
        );
    }
};
Contact.getContactById = async (id, callback) => {
    try {
        const [result] = await pool.query(
            `
            SELECT * FROM \`tb_contact\`
            WHERE ContactId = ?
        `,
            [id],
        );
        if (result.length > 0) {
            return callback(true, `Get contact ID ${id} information successfully`, DataFormat(result)[0]);
        } else {
            return callback(false, `Get contact ID ${id} information does not exist`);
        }
    } catch (error) {
        console.error('Error getting contact by id in contact model:', error);
        return callback(
            false,
            `Get contact ID  ${id} information failed. A server-side problem occurred. Please come back later.`,
            error,
        );
    }
};

Contact.createContact = async (req, callback) => {
    let { full_name, phone_number, email, content } = req.body;
    full_name = full_name ? full_name.trim() : null;
    phone_number = phone_number ? phone_number.trim() : null;
    email = email ? email.trim() : null;
    content = content ? content.trim() : null;
    try {
        const [result] = await pool.query(
            `
            INSERT INTO \`tb_contact\` (FullName, PhoneNumber, Email, Content)  
            VALUES (?,?,?,?)
        `,
            [full_name, phone_number, email, content],
        );
        if (result.affectedRows > 0) {
            return callback(true, 'Create successful contact');
        } else {
            return callback(false, 'Create contact failed');
        }
    } catch (error) {
        console.error('Error creating contact in contact model:', error);
        return callback(false, 'Create failed contact. A server-side problem occurred. Please come back later.', error);
    }
};

Contact.updateContact = async (req, callback) => {
    const { id } = req.params;
    try {
        const [result] = await pool.query('SELECT * FROM `tb_contact` WHERE ContactId = ?', [id]);

        if (result.length === 0) {
            return callback(false, `Update contact id ${id} failed. Contact does not exist.`);
        }
        let { FullName, PhoneNumber, Email, Content, ContactResults, Status } = result[0];
        let { full_name, phone_number, email, content, contact_results, status } = req.body;
        full_name = full_name ? full_name.toString().trim() : FullName;
        phone_number = phone_number ? phone_number.toString().trim() : PhoneNumber;
        email = email ? email.trim() : Email;
        content = content ? content.trim() : Content;
        contact_results = contact_results ? contact_results.trim() : ContactResults;
        status = status ? status.trim() : Status;
        const [resultUpdate] = await pool.query(
            `
            UPDATE \`tb_contact\` SET  
                FullName = ?, 
                PhoneNumber = ?,
                Email = ?,  
                Content = ?, 
                ContactResults = ?,
                Status = ?
            WHERE ContactId = ?
        `,
            [full_name, phone_number, email, content, contact_results, status, id],
        );
        if (resultUpdate.affectedRows > 0) {
            return callback(true, `Update contact information id ${id} successfully`);
        } else {
            return callback(true, `Update contact information id ${id} failed`);
        }
    } catch (error) {
        console.error('Error updating contact in contact model:', error);
        return callback(
            false,
            `Update contact information id ${id} failed. A server-side problem occurred. Please come back later.`,
            error,
        );
    }
};

Contact.deleteContact = async (id, callback) => {
    try {
        const [result] = await pool.query(
            `
            DELETE FROM \`tb_contact\`
            WHERE ContactId = ?
        `,
            [id],
        );
        if (result.affectedRows > 0) {
            return callback(true, `Delete contact id ${id} successfully`);
        } else {
            return callback(false, `Delete contact id ${id} failed`);
        }
    } catch (error) {
        console.error('Error deleting contact in contact model:', error);
        return callback(
            false,
            `Delete contact id ${id} failed. A server-side problem occurred. Please come back later.`,
            error,
        );
    }
};
module.exports = Contact;
