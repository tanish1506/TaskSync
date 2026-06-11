const express = require('express');
const taskController = require('../controllers/taskController');
const {protect} = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router
    .route('/')
    .get(taskController.getAllTasks)
    .post(taskController.createTask);

router
    .route('/:id')
    .get(taskController.getTaskById)
    .put(taskController.updateTask)
    .delete(taskController.deleteTask);

module.exports = router;