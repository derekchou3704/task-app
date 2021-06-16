const express= require('express')
const { createTask, getAllTasks, getTask, updateTask, deleteTask } = require('../controllers/task')
const { auth } = require('../middleware')
const router = new express.Router()

router.route('/tasks')
    .post(auth, createTask)
    .get(auth, getAllTasks)

router.route('/tasks/:id')
    .get(auth, getTask)
    .patch(auth, updateTask)
    .delete(auth, deleteTask)

module.exports = router