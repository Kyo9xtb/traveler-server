const webRoute = require('./web');
const apiRoute = require('./Api');
const path = require('path');
function route(app) {
    app.use('/api/v1', apiRoute);
    app.use('/images/*', (req, res, next) => {
        res.sendFile(path.join(__dirname, '../public/images', 'default_thumbnail.png'));
    });
    app.use('/', webRoute);
}
module.exports = route;
