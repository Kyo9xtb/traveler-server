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
            status: item.Status,
            create_at: item.CreateAt,
            update_at: item.UpdateAt,
        };
        results.push(contact);
    });
    return results;
}
Contact.getContacts = async (callback) => {
    try {
        let [result] = await pool.query(`
            select * from tb_contact
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
            select * from tb_contact   
            where ContactId = ?
        `,
            [id],
        );
        callback(true, `Get contact ID ${id} information successfully`, DataFormat(result));
    } catch (error) {
        callback(false, `Get contact ID  ${id} information failed`, error);
    }
};

Contact.createContact = async (req, callback) => {
    let { FullName, PhoneNumber, Email, Content } = req.body;
    FullName = FullName ? FullName.trim() : null;
    PhoneNumber = PhoneNumber ? PhoneNumber.trim() : null;
    Email = Email ? Email.trim() : null;
    Content = Content ? Content.trim() : null;
    try {
        await pool.query(
            `
            insert into tb_contact (FullName, PhoneNumber, Email, Content)  
            values (?,?,?,?)
        `,
            [FullName, PhoneNumber, Email, Content],
        );
        callback(true, 'Create successful contact');
    } catch (error) {
        callback(false, 'Create failed contact'.error);
    }
};

Contact.updateContact = async (req, callback) => {
    let ID_Contact = req.params.id;
    let { FullName, PhoneNumber, Email, Content } = req.body;
    FullName = FullName ? FullName.trim() : null;
    PhoneNumber = PhoneNumber ? PhoneNumber.trim() : null;
    Email = Email ? Email.trim() : null;
    Content = Content ? Content.trim() : null;
    try {
        let [result] = await pool.query(
            `
            update tb_contact set  FullName = ?, PhoneNumber = ? ,  Email = ? ,  Content  = ?
            where ID_Contact = ?
        `,
            [FullName, PhoneNumber, Email, Content, ID_Contact],
        );
        callback(true, `Update contact information id ${ID_Contact} successfully`);
    } catch (error) {
        callback(false, `Update contact information id ${ID_Contact} failed`, error);
    }
};

Contact.deleteContact = async (id, callback) => {
    try {
        await pool.query(
            `
            delete from tb_contact
            where ID_Contact = ?
        `,
            [id],
        );
        callback(true, `Delete contact id ${id} successfully`);
    } catch (error) {
        callback(false, `Delete contact id ${id} failed`, error);
    }
};
module.exports = Contact;
