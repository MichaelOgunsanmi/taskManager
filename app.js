const express = require('express');
const app = express();
require('./db/mongoose');



const userRouter = require('./routes/users');
const taskRouter = require('./routes/tasks');

// require('./middleware/maintenance503')(app);


app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

module.exports = app;