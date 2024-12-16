const News = require('../models/newsModel');

const handleGetNews = async (req, res, next) => {
    try {
        if (!isNaN(Number(req.params.id))) {
            News.getNewsById(req.params.id, (resStatus, resMessage, resData) => {
                res.status(200).json({ status: resStatus, message: resMessage, result: resData });
            });
        } else {
            News.getNews(req.params.id, (resStatus, resMessage, resData) => {
                res.status(200).json({ status: resStatus, message: resMessage, result: resData });
            });
        }
    } catch (error) {
        next(error);
    }
};

const handleCreateNews = async (req, res, next) => {
    try {
        News.createNews(req, (resStatus, resMessage, resData) => {
            res.status(200).json({ status: resStatus, message: resMessage, result: resData });
        });
    } catch (error) {
        next(error);
    }
};

const handleUpdateNews = async (req, res, next) => {
    try {
        News.updateNews(req, (resStatus, resMessage, resData) => {
            res.status(200).json({ status: resStatus, message: resMessage, result: resData });
        });
    } catch (error) {
        next(error);
    }
};

const handleDeleteNews = async (req, res, next) => {
    try {
        News.deleteNews(req.params.id, (resStatus, resMessage, resData) => {
            res.status(200).json({ status: resStatus, message: resMessage, result: resData });
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    handleGetNews,
    handleCreateNews,
    handleUpdateNews,
    handleDeleteNews,
};
