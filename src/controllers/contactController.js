const Contact = require('../models/ContactModel');

const handleGetContact = async (req, res, next) => {
    try {
        if (req.params.id) {
            Contact.getContactById(req.params.id, (resStatus, resMessage, resData) => {
                res.status(200).json({ status: resStatus, message: resMessage, result: resData });
            });
        } else {
            Contact.getContacts((resStatus, resMessage, resData) => {
                res.status(200).json({ status: resStatus, message: resMessage, result: resData });
            });
        }
    } catch (error) {
        next(error);
    }
};

const handleCreateContact = async (req, res, next) => {
    try {
        Contact.createContact(req, (resStatus, resMessage, resData) => {
            res.status(200).json({ status: resStatus, message: resMessage, result: resData });
        });
    } catch (error) {
        next(error);
    }
};

const handleUpdateContact = async (req, res, next) => {
    try {
        Contact.updateContact(req, (resStatus, resMessage, resData) => {
            res.status(200).json({ status: resStatus, message: resMessage, result: resData });
        });
    } catch (error) {
        next(error);
    }
};
const handleDeleteContact = async (req, res, next) => {
    try {
        Contact.deleteContact(req.params.id, (resStatus, resMessage, resData) => {
            res.status(200).json({ status: resStatus, message: resMessage, result: resData });
        });
    } catch (error) {
        next(error);
    }
};
module.exports = {
    handleGetContact,
    handleCreateContact,
    handleUpdateContact,
    handleDeleteContact,
};
