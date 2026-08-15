const express = require('express')
const router = express.Router()
const { getMeetings, createMeeting, updateMeeting, deleteMeeting } = require('../controllers/meeting.controller')
const { protect } = require('../middleware/auth')
const validate = require('../middleware/validate')
const { createMeetingSchema } = require('../validators/meeting.validator')

router.get('/', protect, getMeetings)
router.post('/', protect, validate(createMeetingSchema), createMeeting)
router.patch('/:id', protect, updateMeeting)
router.delete('/:id', protect, deleteMeeting)

module.exports = router