const Tour = require('../models/tourModel');

const handlerGetTour = (req, res, next) => {
    try {
        if (!isNaN(Number(req.params.id))) {
            Tour.getTourById(req.params.id, (resStatus, resMessage, resData) => {
                if (resData && resData.code) {
                    // res.status(500).json({ status: resStatus, message: resMessage });
                    res.status(500).json('A server side error occurred');
                } else {
                    resData ? res.status(200).json(resData) : res.status(200).json('Not Found');
                }
            });
        } else {
            Tour.getTour(req.params.id, (resStatus, resMessage, resData) => {
                if (resData && resData.code) {
                    // res.status(500).json({ status: resStatus, message: resMessage });
                    res.status(500).json('A server side error occurred');
                } else {
                    // res.status(200).json({ status: resStatus, message: resMessage, result: resData });
                    resData ? res.status(200).json(resData) : res.status(200).json('Not Found');
                }
            });
        }
    } catch (error) {
        console.error('Error getting tour controller:', error);
        next(error);
    }
};

const handlerCreateTour = (req, res, next) => {
    try {
        Tour.createTour(req, (resStatus, resMessage, resData) => {
            if (resData && resData.code) {
                // res.status(500).json({ status: resStatus, message: resMessage });
                res.status(500).json('A server side error occurred');
            } else {
                console.log('resStatus', resStatus, resData);

                // Tour.getTourById(req.params.id, (resStatus, resMessage, resData) => {});
                !resStatus
                    ? res.status(200).json(resMessage)
                    : Tour.getTourById(resData, (resStatus, resMessage, resData) => {
                          res.status(200).json(resData);
                      });
            }
        });
    } catch (error) {
        console.error('Error creating tour controller:', error);
        next(error);
    }
};

const handlerUpdateTour = (req, res, next) => {
    try {
        Tour.updateTour(req, (resStatus, resMessage, resData) => {
            if (resData && resData.code) {
                // res.status(500).json({ status: resStatus, message: resMessage });
                res.status(500).json('A server side error occurred');
            } else {
                !resStatus
                    ? res.status(200).json('Not Found')
                    : Tour.getTourById(resData, (resStatus, resMessage, resData) => {
                          res.status(200).json(resData);
                      });
            }
        });
    } catch (error) {
        console.error('Error updating tour controller:', error);
        next(error);
    }
};

const handlerDeleteTour = (req, res, next) => {
    try {
        Tour.deleteTour(req.params.id, (resStatus, resMessage, resData) => {
            if (resData && resData.code) {
                // res.status(500).json({ status: resStatus, message: resMessage });
                res.status(500).json('A server side error occurred');
            } else {
                // res.status(200).json({ status: resStatus, message: resMessage });
                resStatus ? res.status(200).json(resData) : res.status(200).json('Not Found');
            }
        });
    } catch (error) {
        console.error('Error deleting tour controller:', error);
        next(error);
    }
};

module.exports = {
    handlerGetTour,
    handlerCreateTour,
    handlerUpdateTour,
    handlerDeleteTour,
};
