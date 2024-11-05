const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
require('dotenv').config();
const cors = require('cors');

const routes = require('./src/routes');
const configViewEngine = require('./src/config/viewEngine');

const app = express();

// view engine setup
app.use(logger('dev'));
// app.use(logger('common'));
const corsOptions = { origin: ['http://localhost:3000', 'http://192.168.1.35:3000'], optionsSuccessStatus: 200 };
app.use(cors(corsOptions));
//config req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

//config templaet engine
configViewEngine(app);

// Routes init
routes(app);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
