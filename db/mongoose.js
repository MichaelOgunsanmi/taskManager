const mongoose = require('mongoose');
const config = require('config');

const db = process.env.NODE_ENV !== 'production' ?
            config.get('dbLocal') : config.get('dbAtlas');


console.log(process.env.NODE_ENV, 'NODE_ENV');
// console.log(config.get('dbLocal'), 'local')


mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}).then(() => {
    console.log(`Connected to ${db}`)
});

