const express = require('express');
const router = express.Router();

const auth = require('../middleware/authentication');
const User = require('../models/User');


router.get('/users', async (req, res, next) => {
    try{
        const users = await User.find({});
        res.status(200).send(users);
    }catch(err) {
        res.status(500).send(err.errors)
    }
});

//this send back your profile
router.get('/users/me', auth, async (req, res, next) => {
    res.send(await req.user);
});

//No longer a valid route as we don't want to filter a user by database id
router.get('/users/:id', auth, async (req, res, next) => {
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

router.post('/users/logout', auth, async (req, res, next) => {
    try {
        req.user.tokens = req.user.tokens.filter(token => token.token !== req.token);

        await req.user.save();

        res.status(200).json({user: req.user})
    }catch(err){
        res.status(500).send(err)
    }

});

router.post('/users/logoutAll', auth, async (req, res, next) => {
    try {
        req.user.tokens = [];

        await req.user.save();

        res.status(200).json({user: req.user})
    }catch(err){
        res.status(500).send(err)
    }

});

router.patch('/users/me', auth, async (req, res, next) => {
    //Update error handling;
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'age', 'email', 'password'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) return res.status(400).json({error: "Invalid update operation"});

    try {
        // const user = await User.findById(req.params.id);
        //
        // if (!user) return res.status(404).json({error: 'User with that id does not exist.'});

        updates.forEach(update => req.user[update] = req.body[update]);

        await req.user.save();

        res.status(200).json({user: req.user})
    }catch(err){
        res.status(500).send(err)
    }
});

router.delete('/users/me', auth, async (req, res, next) => {
    try {
        // const deletedUser = await User.findByIdAndDelete(req.params.id);
        //
        // if (!deletedUser) return res.status(400).json({error: 'User with that id does not exist.'});

        // res.status(200).send(deletedUser)

        await req.user.remove();
        res.status(200).send({user: req.user})
    }catch(err){
        res.status(500).send(err)
    }
});



module.exports = router;