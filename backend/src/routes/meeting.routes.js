const express = require('express')
const router = express.Router()
const { getMeetings, createMeeting, updateMeeting, deleteMeeting } = require('../controllers/meeting.controller')
const { protect } = require('../middleware/auth')

router.get('/', protect, getMeetings)
router.post('/', protect, createMeeting)
router.patch('/:id', protect, updateMeeting)
router.delete('/:id', protect, deleteMeeting)

module.exports = router