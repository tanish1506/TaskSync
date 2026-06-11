const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.protect = catchAsync(async(req,res,next) => {
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1];
    }

    if(!token){
        return next(new AppError('You are not logged in. Please log in to gain access.' , 401));
    }

    const decoded = jwt.verify(token,process.env.JWT_SECRET);

    const currentUser = await User.findById(decoded.id)
    if(!currentUser){
        return next(new AppError('The User belonging to this token no longer exists',401));
    }

    req.user = currentUser
    next();
})