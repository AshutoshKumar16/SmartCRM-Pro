const express = require('express')
const router = express.Router()
const { getActivityLogs } = require('../controllers/activityLog.controller')
const { protect, allowRoles } = require('../middleware/auth')

router.get('/', protect, allowRoles('ADMIN', 'MANAGER'), getActivityLogs)

module.exports = router
