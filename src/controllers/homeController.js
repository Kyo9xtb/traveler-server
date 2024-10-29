const getHomePage = (req, res) => {
    res.render('index', { title: 'SaoViet Travel Server' });
};
const getHomePageApi = (req, res) => {
    res.render('index', { title: 'SaoViet Travel Server Api Services' });
};
module.exports = { getHomePage, getHomePageApi };
