const express = require('express')
const router = express.Router()
const { register, login, refresh, logout } = require('../controllers/auth.controller')
const validate = require('../middleware/validate')
const { registerSchema, loginSchema } = require('../validators/auth.validator')
const { protect, allowRoles } = require('../middleware/auth')

router.post('/register', protect, allowRoles('ADMIN'), validate(registerSchema), register)
router.post('/login', validate(loginSchema), login)
router.post('/refresh', refresh)
router.post('/logout', logout)

module.exports = router