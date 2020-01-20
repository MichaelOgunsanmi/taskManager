const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Task = require('./Task');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
        validate(value){
            if(!validator.isEmail(value)) throw new Error('Invalid Email')
        }
    },
    age: {
        type: Number,
        required: true,
        default: 0,
        validate(value){
            if (value < 0) throw new Error('Age must be greater than or equal to 0')
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(value){
            if (value.toLowerCase().includes('password')) throw new Error('Invalid password, choose another password')
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
});

//Creating foreign keys relationships
userSchema.virtual('tasks', {
    ref: 'task',
    localField: "_id",
    foreignField: "owner"
});

//Since it is static, no need for this binding.
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({email});

    if (!user) throw new Error('Unable to login');

    const isPasswordAMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordAMatch) throw new Error('unable to login');

    return user;
};

userSchema.methods.generateAuthToken = async function (){
    const user = this;

    const token = jwt.sign({_id: user._id.toString()}, 'mySuperSecret');

    user.tokens = [...user.tokens, {token}];

    await user.save();

    return token;
};

userSchema.methods.toJSON = function (){
    const user = this;
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.tokens;

    return userObject;
};

userSchema.pre('save', async function (next) {
    const user = this;

    if (user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8);
    }

    next();
});

userSchema.pre('remove', async function (next) {
    const user = this;

    await Task.deleteMany({owner: user._id});

    next();
});

const User = mongoose.model('user', userSchema);
module.exports = User;