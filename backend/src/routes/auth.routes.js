const express = require('express')
const router = express.Router()
const { register, login, refresh, logout } = require('../controllers/auth.controller')
const validate = require('../middleware/validate')
const { registerSchema, loginSchema } = require('../validators/auth.validator')

router.post('/register', validate(registerSchema), register)
router.post('/login', validate(loginSchema), login)
router.post('/refresh', refresh)
router.post('/logout', logout)

module.exports = router