const express = require('express');
const router = express.Router();

const Task = require('../models/Task');


router.get('/tasks', async (req, res, next) => {
    try{
        const tasks = await Task.find({});
        res.status(200).send(tasks);
    }catch(err) {
        res.status(500).send(err.errors)
    }
});

router.get('/tasks/:id', async (req, res, next) => {
    try{
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({error: 'Task with that id is not present'});
        res.status(200).send(task);
    }catch(err) {
        res.status(500).send(err.errors)
    }
});

router.post('/tasks', async (req, res, next) => {
    try{
        const newTask = new Task(req.body);
        await newTask.save();
        res.status(201).send(newTask);
    }catch(err) {
        res.status(500).send(err.errors)
    }
});

router.patch('/tasks/:id', async (req, res, next) => {
    //Update error handling;
    const updates = Object.keys(req.body);
    const allowedUpdates = ['description', 'completed'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) return res.status(400).json({error: "Invalid update operation"});

    try {
        // const task = await Task.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});

        const task = await Task.findById(req.params.id);

        if (!task) return res.status(404).json({error: 'Task with that id does not exist.'});

        updates.forEach(update => task[update] = req.body[update]);

        await task.save();

        res.status(200).send(task)
    }catch(err){
        res.status(500).send(err)
    }
});

router.delete('/tasks/:id', async (req, res, next) => {
    try {
        const deletedTask = await Task.findByIdAndDelete(req.params.id);

        if (!deletedTask) return res.status(400).json({error: 'Task with that id does not exist.'});

        res.status(200).send(deletedTask)
    }catch(err){
        res.status(500).send(err)
    }
});


module.exports = router;