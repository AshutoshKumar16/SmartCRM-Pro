const express = require('express')
const router = express.Router()
const { getCustomers, convertLeadToCustomer } = require('../controllers/customer.controller')
const { protect } = require('../middleware/auth')
const validate = require('../middleware/validate')
const { convertLeadSchema } = require('../validators/customer.validator')

router.get('/', protect, getCustomers)
router.post('/convert', protect, validate(convertLeadSchema), convertLeadToCustomer)

module.exports = router