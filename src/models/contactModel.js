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
        let [result] = await pool.query(`
            SELECT * FROM \`tb_contact\`
        `);

        callback(true, 'Get info contact successfully', DataFormat(result));
    } catch (error) {
        callback(false, 'Get info contact failed', error);
    }
};
Contact.getContactById = async (id, callback) => {
    try {
        let [result] = await pool.query(
            `
            SELECT * FROM \`tb_contact\`   
            WHERE ContactId = ?
        `,
            [id],
        );
        callback(true, `Get contact ID ${id} information successfully`, DataFormat(result)[0]);
    } catch (error) {
        callback(false, `Get contact ID  ${id} information failed`, error);
    }
};

Contact.createContact = async (req, callback) => {
    let { full_name, phone_number, email, content } = req.body;
    full_name = full_name ? full_name.trim() : null;
    phone_number = phone_number ? phone_number.trim() : null;
    email = email ? email.trim() : null;
    content = content ? content.trim() : null;
    try {
        await pool.query(
            `
            INSERT INTO \`tb_contact\` (FullName, PhoneNumber, Email, Content)  
            VALUES (?,?,?,?)
        `,
            [full_name, phone_number, email, content],
        );
        callback(true, 'Create successful contact');
    } catch (error) {
        callback(false, 'Create failed contact'.error);
    }
};

Contact.updateContact = async (req, callback) => {
    let ID_Contact = req.params.id;
    let { full_name, phone_number, email, content, contact_results, status } = req.body;
    full_name = full_name ? full_name.toString().trim() : null;
    phone_number = phone_number ? phone_number.toString().trim() : null;
    email = email ? email.trim() : null;
    content = content ? content.trim() : null;
    contact_results = contact_results ? contact_results.trim() : null;
    status = status ? status.trim() : null;

    try {
        let [result] = await pool.query(
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
            [full_name, phone_number, email, content, contact_results, status, ID_Contact],
        );
        callback(true, `Update contact information id ${ID_Contact} successfully`);
    } catch (error) {
        console.log(error);

        callback(false, `Update contact information id ${ID_Contact} failed`, error);
    }
};

Contact.deleteContact = async (id, callback) => {
    try {
        await pool.query(
            `
            DELETE FROM \`tb_contact\`
            WHERE ContactId = ?
        `,
            [id],
        );
        callback(true, `Delete contact id ${id} successfully`);
    } catch (error) {
        callback(false, `Delete contact id ${id} failed`, error);
    }
};
module.exports = Contact;
