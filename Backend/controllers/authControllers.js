const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '30d',
    });
};

// Register user
exports.register = catchAsync(async (req, res, next) => {
    const { name, email, password, confirmPassword } = req.body;

    if (!password || !confirmPassword) {
        return next(new AppError('Please provide both password and confirmation.', 400));
    }

    if (password !== confirmPassword) {
        return next(new AppError('Passwords do not match.', 400));
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return next(new AppError('User already exists.', 400));
    }

    const newUser = await User.create({ name, email, password });

    const token = signToken(newUser._id);
    newUser.password = undefined;

    res.status(201).json({
        success: true,
        token,
        data: {
            user: newUser,
        },
    });
});

// Login user
exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new AppError('Please provide both email and password', 400));
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect email or password', 401));
    }

    const token = signToken(user._id);
    user.password = undefined;

    res.status(200).json({
        success: true,
        token,
        data: {
            user,
        },
    });
});