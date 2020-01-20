const maintenance503 = (app) => {
    app.use((req, res, next) => {
        res.status(503).send('Service currently unavailable');
    });
};

module.exports = maintenance503;