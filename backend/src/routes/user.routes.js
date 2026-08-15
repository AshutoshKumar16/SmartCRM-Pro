const express = require('express')
const router = express.Router()
const { getEmployees } = require('../controllers/user.controller')
const { protect, allowRoles } = require('../middleware/auth')

router.get('/', protect, allowRoles('ADMIN', 'MANAGER'), getEmployees)

module.exports = router
