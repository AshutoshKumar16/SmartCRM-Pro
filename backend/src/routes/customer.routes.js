const express = require('express')
const router = express.Router()
const { getCustomers, convertLeadToCustomer } = require('../controllers/customer.controller')
const { protect } = require('../middleware/auth')

router.get('/', protect, getCustomers)
router.post('/convert', protect, convertLeadToCustomer)

module.exports = router