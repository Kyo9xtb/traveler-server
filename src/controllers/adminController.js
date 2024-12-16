const md5 = require('blueimp-md5');

const Admin = require('../models/adminModel');

const handleLogin = async (req, res, next) => {
    try {
        Admin.get(req, (resData) => {
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
        next(error);
    }
};

const handleLogout = async (req, res, next) => {
    try {
        const { sessionID } = req.cookies;
        Admin.deleteSession(sessionID);
        res.setHeader('Set-Cookie', 'sessionID=; HttpOnly; Max-Age=0;Path=/').status(200).json('resData');
    } catch (error) {
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
        next(error);
    }
};

module.exports = {
    handleLogin,
    handleLogout,
    handleCheckLogin,
};
