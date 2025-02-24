const md5 = require('blueimp-md5');

const Admin = require('../models/adminModel');

const handleLogin = async (req, res, next) => {
    try {
        Admin.getLogin(req, (resData) => {
            if (resData) {
                const createAt = Date.now();
                const expiresAt = createAt + 3600 * 1000 * 24 * 3; // 3 days
                const createSessionId = createAt + resData.email + resData.admin_id;
                const sessionID = md5(createSessionId);
                const data = {
                    sessionID,
                    adminId: resData.admin_id,
                    createAt,
                    expiresAt,
                };
                Admin.createSession(data, (resAction) => {
                    if (resAction) {
                        res.setHeader(
                            'Set-Cookie',
                            `sessionID=${sessionID}; HttpOnly; Expires=${new Date(expiresAt).toUTCString()}; Path=/`,
                        )
                            .status(200)
                            .json(resData);
                    } else {
                        res.status(401).json('Login failed');
                    }
                });
            } else {
                res.status(401).json('Login failed');
            }
        });
    } catch (error) {
        console.error('Error login admin controller:', error);
        next(error);
    }
};

const handleLogout = async (req, res, next) => {
    try {
        const { sessionID } = req.cookies;
        Admin.deleteSession(sessionID);
        res.setHeader('Set-Cookie', 'sessionID=; HttpOnly; Max-Age=0;Path=/').status(200).json('resData');
    } catch (error) {
        console.error('Error logout admin controller:', error);
        next(error);
    }
};
 
const handleCheckLogin = async (req, res, next) => {
    try {
        const { sessionID } = req.cookies;
        Admin.getSession(sessionID, (resAction) => {
            if (resAction && new Date(resAction.ExpiresAt) > Date.now()) {
                Admin.getAdminById(resAction.AdminId, (resStatus, resMessage, resData) => {
                    if (resStatus) {
                        return res.status(200).json(resData);
                    } else {
                        Admin.deleteSession(sessionID);
                        return res
                            .setHeader('Set-Cookie', 'sessionID=; HttpOnly; Max-Age=0;Path=/')
                            .status(401)
                            .json('Session expired');
                    }
                });
            } else {
                Admin.deleteSession(sessionID);
                res.setHeader('Set-Cookie', 'sessionID=; HttpOnly; Max-Age=0;Path=/')
                    .status(401)
                    .json('Session expired');
            }
        });
    } catch (error) {
        console.error('Error check login admin controller:', error);
        next(error);
    }
};

const handleGetAdmin = async (req, res, next) => {
    try {
        if (req.params.id) {
            Admin.getAdminById(req.params.id, (resStatus, resMessage, resData) => {
                return res.status(200).json({ status: resStatus, message: resMessage, result: resData });
            });
        } else {
            Admin.getAdmin(req.params.id, (resStatus, resMessage, resData) => {
                return res.status(200).json({ status: resStatus, message: resMessage, result: resData });
            });
        }
    } catch (error) {
        console.error('Error getting admin controller:', error);
        next(error);
    }
};

const handleCreateAdmin = async (req, res, next) => {
    try {
        Admin.createAdmin(req, (resStatus, resMessage, resData) => {
            if (resData && resData.code) {
                res.status(500).json({ status: resStatus, message: resMessage });
            } else {
                res.status(200).json({ status: resStatus, message: resMessage, result: resData });
            }
        });
    } catch (error) {
        console.error('Error creating user controller:', error);
        next(error);
    }
};

const handleUpdateAdmin = async (req, res, next) => {
    try {
        Admin.updateAdmin(req, (resStatus, resMessage, resData) => {
            if (resData && resData.code) {
                res.status(500).json({ status: resStatus, message: resMessage });
            } else {
                res.status(200).json({ status: resStatus, message: resMessage, result: resData });
            }
        });
    } catch (error) {
        console.error('Error updating user controller:', error);
        next(error);
    }
};

const handleDeleteAdmin = async (req, res, next) => {
    try {
        Admin.deleteAdmin(req.params.id, (resStatus, resMessage, resData) => {
            if (resData && resData.code) {
                res.status(500).json({ status: resStatus, message: resMessage });
            } else {
                res.status(200).json({ status: resStatus, message: resMessage, result: resData });
            }
        });
    } catch (error) {
        console.error('Error deleting user controller:', error);
        next(error);
    }
};

const handleCheckEmail = async (req, res, next) => {
    try {
        Admin.getCheckEmail(req.body.email, (resStatus, resMessage, resData) => {
            if (resData && resData.code) {
                res.status(500).json({ status: resStatus, message: resMessage });
            } else {
                res.status(200).json(resStatus);
            }
        });
    } catch (error) {
        console.error('Error getting check email user controller:', error);
        next(error);
    }
};
module.exports = {
    handleLogin,
    handleLogout,
    handleCheckLogin,
    handleGetAdmin,
    handleCreateAdmin,
    handleUpdateAdmin,
    handleDeleteAdmin,
    handleCheckEmail,
};
