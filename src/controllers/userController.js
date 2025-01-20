const md5 = require('blueimp-md5');
const User = require('../models/userModel');

const handleGetUser = async (req, res, next) => {
    try {
        if (req.params.id) {
            User.getUsersById(req.params.id, (resStatus, resMessage, resData) => {
                if (resData && resData.code) {
                    res.status(500).json({ status: resStatus, message: resMessage });
                } else {
                    res.status(200).json({ status: resStatus, message: resMessage, result: resData });
                }
            });
        } else {
            User.getUsers((resStatus, resMessage, resData) => {
                if (resData && resData.code) {
                    res.status(500).json({ status: resStatus, message: resMessage });
                } else {
                    res.status(200).json({ status: resStatus, message: resMessage, result: resData });
                }
            });
        }
    } catch (error) {
        console.error('Error getting users:', error);
        next(error);
    }
};

const handleCreateUser = async (req, res, next) => {
    try {
        User.createUser(req, (resStatus, resMessage, resData) => {
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

const handleUpdateUser = async (req, res, next) => {
    try {
        User.updateUser(req, (resStatus, resMessage, resData) => {
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

const handleDeleteUser = async (req, res, next) => {
    try {
        User.deleteUser(req.params.id, (resStatus, resMessage, resData) => {
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
        User.getCheckEmail(req.body.email, (resStatus, resMessage, resData) => {
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

const handleLogin = async (req, res, next) => {
    try {
        User.getUserLogin(req, (resStatus, resMessage, resData) => {
            if (resData && resData.code) {
                res.status(500).json({ status: resStatus, message: resMessage });
            } else {
                if (resData) {
                    const createAt = Date.now();
                    const expiresAt = createAt + 3600 * 1000 * 24 * 3; // 3 days
                    const createSessionId = createAt + resData.email + resData.user_id;
                    const sessionID = md5(createSessionId);
                    const data = {
                        sessionID,
                        userId: resData.user_id,
                        createAt,
                        expiresAt,
                    };
                    User.createSession(data, (resAction) => {
                        if (resAction) {
                            res.setHeader(
                                'Set-Cookie',
                                `sessionID=${sessionID}; HttpOnly; Expires=${new Date(
                                    expiresAt,
                                ).toUTCString()}; Path=/`,
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
            }
        });
    } catch (error) {
        console.error('Error logging user controller:', error);
        next(error);
    }
};

const handleLogout = async (req, res, next) => {
    try {
        const { sessionID } = req.cookies;
        if (sessionID) {
            await User.deleteSession(sessionID);
            res.setHeader('Set-Cookie', 'sessionID=; HttpOnly; Max-Age=0;Path=/').status(200).json('Logged out');
        } else {
            res.status(401).json('Session not found');
        }
    } catch (error) {
        console.error('Error logout user controller:', error);

        next(error);
    }
};

const handleCheckLogin = async (req, res, next) => {
    try {
        const { sessionID } = req.cookies;
        // console.log('sessionID', sessionID);
        if (sessionID) {
            await User.getSession(sessionID, (resAction) => {
                // console.log('resAction', resAction);
                if (resAction && new Date(resAction.ExpiresAt) > Date.now()) {
                    User.getUsersById(resAction.UserId, (resStatus, resMessage, resData) => {
                        if (resStatus) {
                            // console.log('resData', resData);
                            return res.status(200).json(resData);
                        } else {
                            User.deleteSession(sessionID);
                            return res
                                .setHeader('Set-Cookie', 'sessionID=; HttpOnly; Max-Age=0;Path=/')
                                .status(401)
                                .json('Session expired');
                        }
                    });
                } else {
                    User.deleteSession(sessionID);
                    return res
                        .setHeader('Set-Cookie', 'sessionID=; HttpOnly; Max-Age=0;Path=/')
                        .status(401)
                        .json('Session expired');
                }
            });
        } else {
            res.status(401).json('Session not found');
        }
    } catch (error) {
        console.error('Error checking login user controller:', error);
        next(error);
    }
};
module.exports = {
    handleGetUser,
    handleCreateUser,
    handleUpdateUser,
    handleDeleteUser,
    handleCheckLogin,
    handleLogout,
    handleLogin,
    handleCheckEmail,
};
