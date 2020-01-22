const mongoose = require('mongoose');
const config = require('config');

mongoose.connect(config.get('dbLocal'), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}).then(() => {
    console.log('Connected to dbLocal')
});

mongoose.connect(config.get('dbAtlas'), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}).then(() => {
    console.log('Connected to dbAtlas')
});

