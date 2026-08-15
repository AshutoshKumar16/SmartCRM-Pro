const express = require('express')
const router = express.Router()
const { getTasks, createTask, updateTask, deleteTask } = require('../controllers/task.controller')
const { protect } = require('../middleware/auth')
const validate = require('../middleware/validate')
const { createTaskSchema } = require('../validators/task.validator')

router.get('/', protect, getTasks)
router.post('/', protect, validate(createTaskSchema), createTask)
router.patch('/:id', protect, updateTask)
router.delete('/:id', protect, deleteTask)

module.exports = router