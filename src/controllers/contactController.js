const Contact = require('../models/contactModel');

const handleGetContact = async (req, res, next) => {
    try {
        if (req.params.id) {
            Contact.getContactById(req.params.id, (resStatus, resMessage, resData) => {
                if (resData.code) {
                    res.status(500).json({ status: resStatus, message: resMessage });
                } else {
                    res.status(200).json({ status: resStatus, message: resMessage, result: resData });
                }
            });
        } else {
            Contact.getContacts((resStatus, resMessage, resData) => {
                if (resData.code) {
                    res.status(500).json({ status: resStatus, message: resMessage });
                } else {
                    res.status(200).json({ status: resStatus, message: resMessage, result: resData });
                }
            });
        }
    } catch (error) {
        console.error('Error getting contact controller:', error);
        next(error);
    }
};

const handleCreateContact = async (req, res, next) => {
    try {
        Contact.createContact(req, (resStatus, resMessage, resData) => {
            if (resData.code) {
                res.status(500).json({ status: resStatus, message: resMessage });
            } else {
                res.status(200).json({ status: resStatus, message: resMessage, result: resData });
            }
        });
    } catch (error) {
        console.error('Error creating contact controller:', error);
        next(error);
    }
};

const handleUpdateContact = async (req, res, next) => {
    try {
        Contact.updateContact(req, (resStatus, resMessage, resData) => {
            if (resData && resData.code) {
                res.status(500).json({ status: resStatus, message: resMessage });
            } else {
                res.status(200).json({ status: resStatus, message: resMessage, result: resData });
            }
        });
    } catch (error) {
        console.error('Error updating contact controller:', error);
        next(error);
    }
};
const handleDeleteContact = async (req, res, next) => {
    try {
        Contact.deleteContact(req.params.id, (resStatus, resMessage, resData) => {
            if (resData && resData.code) {
                res.status(500).json({ status: resStatus, message: resMessage });
            } else {
                res.status(200).json({ status: resStatus, message: resMessage });
            }
        });
    } catch (error) {
        console.error('Error deleting contact controller:', error);
        next(error);
    }
};
module.exports = {
    handleGetContact,
    handleCreateContact,
    handleUpdateContact,
    handleDeleteContact,
};
