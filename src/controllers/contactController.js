const Contact = require('../models/ContactModel');

const handlerGetContact = async (req, res, next) => {
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

const handlerCreateContact = async (req, res, next) => {
    try {
        Contact.createContact(req, (resStatus, resMessage, resData) => {
            res.status(200).json({ status: resStatus, message: resMessage, result: resData });
        });
    } catch (error) {
        next(error);
    }
};

const handlerUpdateContact = async (req, res, next) => {
    try {
        Contact.updateContact(req, (resStatus, resMessage, resData) => {
            res.status(200).json({ status: resStatus, message: resMessage, result: resData });
        });
    } catch (error) {
        next(error);
    }
};
const handlerDeleteContact = async (req, res, next) => {
    try {
        Contact.deleteContact(req.params.id, (resStatus, resMessage, resData) => {
            res.status(200).json({ status: resStatus, message: resMessage, result: resData });
        });
    } catch (error) {
        next(error);
    }
};
module.exports = {
    handlerGetContact,
    handlerCreateContact,
    handlerUpdateContact,
    handlerDeleteContact,
};
