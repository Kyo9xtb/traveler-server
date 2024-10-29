const webRoute = require('./web');
const apiRoute = require('./api');
function route(app) {
    app.use('/api/v1', apiRoute);
    app.use('/api', apiRoute);
    app.use('/', webRoute);
}
module.exports = route;
