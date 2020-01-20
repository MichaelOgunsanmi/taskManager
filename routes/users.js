const express = require('express');
const router = express.Router();

const User = require('../models/User');


router.get('/users', async (req, res, next) => {
    try{
        const users = await User.find({});
        res.status(200).send(users);
    }catch(err) {
        res.status(500).send(err.errors)
    }
});

router.get('/users/:id', async (req, res, next) => {
    try{
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({error: 'User with that id is not present'});
        res.status(200).send(user);
    }catch(err) {
        res.status(500).send(err.errors)
    }
});

router.post('/users', async (req, res, next) => {
    try{
        const user = new User(req.body);
        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).json({user, token});
    }catch(err) {
        res.status(400).send(err)
    }
});

router.post('/users/login', async (req, res, next) => {
    try {
        const {email, password} = req.body;

        const user = await User.findByCredentials(email, password)
        const token = await user.generateAuthToken();

        res.status(200).json({user, token})
    }catch(err){
        res.status(400).send(err)
    }

});

router.patch('/users/:id', async (req, res, next) => {
    //Update error handling;
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'age', 'email', 'password'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) return res.status(400).json({error: "Invalid update operation"});

    try {
        const user = await User.findById(req.params.id);

        if (!user) return res.status(404).json({error: 'User with that id does not exist.'});

        updates.forEach(update => user[update] = req.body[update]);

        await user.save();

        res.status(200).send(user)
    }catch(err){
        res.status(500).send(err)
    }
});

router.delete('/users/:id', async (req, res, next) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);

        if (!deletedUser) return res.status(400).json({error: 'User with that id does not exist.'});

        res.status(200).send(deletedUser)
    }catch(err){
        res.status(500).send(err)
    }
});



module.exports = router;