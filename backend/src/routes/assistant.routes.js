const express = require('express')
const router = express.Router()
const { chatWithAssistant } = require('../controllers/assistant.controller')
const { protect } = require('../middleware/auth')

router.post('/chat', protect, chatWithAssistant)

module.exports = router