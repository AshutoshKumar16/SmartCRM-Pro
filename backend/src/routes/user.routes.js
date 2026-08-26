const express = require('express')
const router = express.Router()
const { getEmployees, getLeaderboard } = require('../controllers/user.controller')
const { protect, allowRoles } = require('../middleware/auth')

router.get('/', protect, allowRoles('ADMIN', 'MANAGER'), getEmployees)
router.get('/leaderboard', protect, getLeaderboard)

module.exports = router