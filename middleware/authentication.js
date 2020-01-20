const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authentication = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, 'mySuperSecret');

        const user = await User.findOne({_id: decoded._id, 'tokens.token': token});
        if (!user) throw new Error();

        req.token = token;
        req.user = user;
        next();


    }catch (err) {
        res.status(401).json({error: 'Unable to authenticate user'});
    }
};

module.exports = authentication;