const News = require('../models/newsModel');

const handleGetNews = async (req, res, next) => {
    try {
        if (!isNaN(Number(req.params.id))) {
            News.getNewsById(req.params.id, (resStatus, resMessage, resData) => {
                if (resData && resData.code) {
                    res.status(500).json({ status: resStatus, message: resMessage });
                } else {
                    res.status(200).json({ status: resStatus, message: resMessage, result: resData });
                }
            });
        } else {
            News.getNews(req.params.id, (resStatus, resMessage, resData) => {
                if (resData && resData.code) {
                    res.status(500).json({ status: resStatus, message: resMessage });
                } else {
                    res.status(200).json({ status: resStatus, message: resMessage, result: resData });
                }
            });
        }
    } catch (error) {
        console.error('Error getting news controller:', error);
        next(error);
    }
};

const handleCreateNews = async (req, res, next) => {
    try {
        News.createNews(req, (resStatus, resMessage, resData) => {
            if (resData && resData.code) {
                res.status(500).json({ status: resStatus, message: resMessage });
            } else {
                res.status(200).json({ status: resStatus, message: resMessage, result: resData });
            }
        });
    } catch (error) {
        console.error('Error creating news controller:', error);
        next(error);
    }
};

const handleUpdateNews = async (req, res, next) => {
    try {
        News.updateNews(req, (resStatus, resMessage, resData) => {
            if (resData && resData.code) {
                res.status(500).json({ status: resStatus, message: resMessage });
            } else {
                res.status(200).json({ status: resStatus, message: resMessage, result: resData });
            }
        });
    } catch (error) {
        console.error('Error updating news controller:', error);
        next(error);
    }
};

const handleDeleteNews = async (req, res, next) => {
    try {
        News.deleteNews(req.params.id, (resStatus, resMessage, resData) => {
            if (resData && resData.code) {
                res.status(500).json({ status: resStatus, message: resMessage });
            } else {
                res.status(200).json({ status: resStatus, message: resMessage });
            }
        });
    } catch (error) {
        console.error('Error deleting news controller:', error);
        next(error);
    }
};

module.exports = {
    handleGetNews,
    handleCreateNews,
    handleUpdateNews,
    handleDeleteNews,
};
