const app = require('./app');
const config = require('config');


const PORT = process.env.PORT || config.get('PORT');
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
});

