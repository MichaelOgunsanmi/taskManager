const maintenance503 = (app) => {
    app.use((req, res, next) => {
        res.status(503).send('Service currently unavailable');
    });
};

module.exports = maintenance503;

//For the above implementation, i.e using it with app.use(), to call it you pass
// the instance of app you are currently working with as below
// require('./middleware/maintenance503')(app);
// this is great if you wanna block everything coming through app



// another way of writing it is
/*
const maintenance2 = (req, res, next) => {
        res.status(503).send('Service currently unavailable');
    }

//To use, import it as a middleware and use it as
const maintenance = require('../middleware/maintenance503');

router.get('/users', maintenance , async (req, res, next) => {
    // code to run if it passes
    try{
        const users = await User.find({});
        res.status(200).send(users);
    }catch(err) {
        res.status(500).send(err.errors)
    }
});

//this is great for route blocking

 */