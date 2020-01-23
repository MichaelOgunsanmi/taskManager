const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const config = require('config');

const User = require('../../models/User');
const Task = require('../../models/Task');

const userOneId = new mongoose.Types.ObjectId();
const userOne = {
    _id: userOneId,
    name: 'abcde',
    age: 1,
    email: 'gfe@ds.ba',
    password: '1234567',
    tokens: [{
        token: jwt.sign({_id: userOneId}, config.get('jwtPrivateKey'))
    }]
};

const userTwoId = new mongoose.Types.ObjectId();
const userTwo = {
    _id: userTwoId,
    name: 'abcde',
    age: 2,
    email: 'hgfe@ds.ba',
    password: '1234567',
    tokens: [{
        token: jwt.sign({_id: userTwoId}, config.get('jwtPrivateKey'))
    }]
};

const taskOne = {
    _id: new mongoose.Types.ObjectId(),
    description: 'First task',
    completed: true,
    owner: userOne._id
};

const taskTwo = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Second task',
    completed: false,
    owner: userOne._id
};

const taskThree = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Third task',
    completed: true,
    owner: userTwo._id
};

const setupDatabase = async () => {
    await User.deleteMany({});
    await Task.deleteMany({});
    await new User(userOne).save();
    await new User(userTwo).save();
    await new Task(taskOne).save();
    await new Task(taskTwo).save();
    await new Task(taskThree).save();
};

module.exports = {
    userOneId,
    userOne,
    userTwo,
    taskOne,
    taskTwo,
    taskThree,
    setupDatabase
};