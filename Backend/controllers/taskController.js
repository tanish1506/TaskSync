const Task = require('../models/taskModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

// Get all tasks
exports.getAllTasks = catchAsync(async (req, res, next) => {
    let queryObj = { userId: req.user._id || req.user.id };

    if (req.query.status) queryObj.status = req.query.status;
    if (req.query.priority) queryObj.priority = req.query.priority;

    if (req.query.search) {
        queryObj.title = { $regex: req.query.search, $options: 'i' };
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const tasks = await Task.find(queryObj).sort({ createdAt: -1 }).skip(skip).limit(limit);
    const totalTasks = await Task.countDocuments(queryObj);

    res.status(200).json({
        success: true,
        results: tasks.length,
        totalTasks,
        totalPages: Math.ceil(totalTasks / limit),
        currentPage: page,
        data: { tasks },
    });
});

// Create task
exports.createTask = catchAsync(async (req, res, next) => {
    const { title, description, status, priority, tag, due } = req.body;

    const incomingStatus = (status || 'pending').toLowerCase();
    
    let incomingPriority = 'medium';
    const rawPriority = priority || tag || 'medium';
    if (rawPriority.toLowerCase().includes('high')) incomingPriority = 'high';
    if (rawPriority.toLowerCase().includes('low')) incomingPriority = 'low';

    const newTask = await Task.create({
        title,
        description,
        status: incomingStatus,
        priority: incomingPriority,
        due: due || null,
        userId: req.user._id || req.user.id,
    });

    res.status(201).json({
        success: true,
        data: { task: newTask },
    });
});

// Update task
exports.updateTask = catchAsync(async (req, res, next) => {
    // Find the task by ID and owner
    let task = await Task.findOne({ _id: req.params.id, userId: req.user._id || req.user.id });

    if (!task) {
        return next(new AppError('No task found with that ID belonging to this user.', 404));
    }

    // Assign status if provided
    if (req.body.status) {
        task.status = req.body.status.toLowerCase();
    }
    
    // Copy other updated fields
    Object.keys(req.body).forEach((key) => {
        if (key !== 'status') {
            task[key] = req.body[key];
        }
    });

    // Save the task
    const updatedTask = await task.save();

    res.status(200).json({
        success: true,
        data: { task: updatedTask },
    });
});

// Get task by ID
exports.getTaskById = catchAsync(async (req, res, next) => {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id || req.user.id });

    if (!task) {
        return next(new AppError('No task found with that ID belonging to this user.', 404));
    }

    res.status(200).json({
        success: true,
        data: { task },
    });
});

// Delete task
exports.deleteTask = catchAsync(async (req, res, next) => {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user._id || req.user.id });

    if (!task) {
        return next(new AppError('No task found with that ID belonging to this user.', 404));
    }

    res.status(200).json({
        success: true,
        message: 'Task deleted successfully.',
    });
});