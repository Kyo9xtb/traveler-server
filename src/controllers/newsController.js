const News = require('../models/newsModel');

const handlerGetNews = async (req, res, next) => {
    try {
        if (req.params.id) {
            News.getNewsById(req.params.id, (resStatus, resMessage, resData) => {
                res.status(200).json({ status: resStatus, message: resMessage, result: resData });
            });
        } else {
            News.getNews((resStatus, resMessage, resData) => {
                res.status(200).json({ status: resStatus, message: resMessage, result: resData });
            });
        }
    } catch (error) {
        next(error);
    }
};

const handlerCreateNews = async (req, res, next) => {
    try {
        News.createNews(req, (resStatus, resMessage, resData) => {
            res.status(200).json({ status: resStatus, message: resMessage, result: resData });
        });
    } catch (error) {
        next(error);
    }
};

const handlerUpdateNews = async (req, res, next) => {
    try {
        News.updateNews(req, (resStatus, resMessage, resData) => {
            res.status(200).json({ status: resStatus, message: resMessage, result: resData });
        });
    } catch (error) {
        next(error);
    }
};

const handlerDeleteNews = async (req, res, next) => {
    try {
        News.deleteNews(req.params.id, (resStatus, resMessage, resData) => {
            res.status(200).json({ status: resStatus, message: resMessage, result: resData });
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    handlerGetNews,
    handlerCreateNews,
    handlerUpdateNews,
    handlerDeleteNews,
};
