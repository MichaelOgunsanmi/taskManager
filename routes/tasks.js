const express = require('express');
const router = express.Router();

const auth = require('../middleware/authentication');
const Task = require('../models/Task');


router.get('/tasks', async (req, res, next) => {
    try{
        const tasks = await Task.find({});
        res.status(200).send(tasks);
    }catch(err) {
        res.status(500).send(err.errors)
    }
});

// /tasks/me?completed=false
// /tasks/me?skip=20&limit=2
// /tasks/me?sortBy=createdAt:asc
router.get('/tasks/me', auth, async (req, res, next) => {
    const match = {};
    if (req.query.completed)
        match.completed = req.query.completed.toLowerCase() === 'true';

    const sort = {};
    if (req.query.sortBy){
        const parts = req.query.sortBy.split(":");
        sort[parts[0]] = parts[1].toLowerCase() === 'desc' ? -1 : 1;
    }

    console.log(sort)

    try{
        // const tasks = await Task.find({owner: req.user._id});
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate();
        res.status(200).json({tasks: req.user.tasks});
    }catch(err) {
        res.status(500).send(err.errors)
    }
});

router.get('/tasks/:id', auth, async (req, res, next) => {
    const _id = req.params.id;
    try{
        const task = await Task.findOne({_id, owner: req.user._id});
        if (!task) return res.status(404).json({error: 'Task with that id is not present'});
        res.status(200).send(task);
    }catch(err) {
        res.status(500).send(err.errors)
    }
});

router.post('/tasks', auth, async (req, res, next) => {
    try{
        const newTask = new Task({
            ...req.body,
            owner: req.user._id
        });
        await newTask.save();
        res.status(201).send(newTask);
    }catch(err) {
        res.status(500).send(err.errors)
    }
});

router.patch('/tasks/:id', auth, async (req, res, next) => {
    //Update error handling;
    const updates = Object.keys(req.body);
    const allowedUpdates = ['description', 'completed'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) return res.status(400).json({error: "Invalid update operation"});

    try {
        // const task = await Task.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});

        const task = await Task.findOne({_id: req.params.id, owner: req.user._id});

        if (!task) return res.status(404).json({error: 'Task with that id does not exist.'});

        updates.forEach(update => task[update] = req.body[update]);

        await task.save();

        res.status(200).send(task)
    }catch(err){
        res.status(500).send(err)
    }
});

router.delete('/tasks/:id', auth, async (req, res, next) => {
    try {
        const deletedTask = await Task.findOneAndDelete({_id: req.params.id, owner: req.user._id});

        if (!deletedTask) return res.status(400).json({error: 'Task with that id does not exist.'});

        res.status(200).send(deletedTask)
    }catch(err){
        res.status(500).send(err)
    }
});


module.exports = router;