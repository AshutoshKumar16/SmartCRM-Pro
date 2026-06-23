const express = require('express')
const router = express.Router()
const { createPublicLead, getLeads, createLead, updateLeadStatus, assignLead, deleteLead } = require('../controllers/lead.controller')
const { protect, allowRoles } = require('../middleware/auth')

// Public
router.post('/public', createPublicLead)

// Protected
router.get('/', protect, getLeads)
router.post('/', protect, allowRoles('ADMIN', 'MANAGER'), createLead)
router.patch('/:id/status', protect, updateLeadStatus)
router.patch('/:id/assign', protect, allowRoles('ADMIN', 'MANAGER'), assignLead)
router.delete('/:id', protect, allowRoles('ADMIN', 'MANAGER'), deleteLead)

module.exports = router