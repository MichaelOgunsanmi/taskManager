const express = require('express');
const app = express();
const config = require('config');
require('./db/mongoose');



const userRouter = require('./routes/users');
const taskRouter = require('./routes/tasks');

// require('./middleware/maintenance503')(app);

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);



const PORT = process.env.PORT || config.get('PORT');
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
});