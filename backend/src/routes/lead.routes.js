const express = require('express')
const router = express.Router()
const { createPublicLead, getLeads, createLead, updateLeadStatus, assignLead, deleteLead, scoreLead, generateEmail, sendEmailToLead, getEmailHistory } = require('../controllers/lead.controller')
const { protect, allowRoles } = require('../middleware/auth')
const validate = require('../middleware/validate')
const { createLeadSchema } = require('../validators/lead.validator')

// Public
router.post('/public', createPublicLead)

// Protected
router.get('/', protect, getLeads)
router.post('/', protect, allowRoles('ADMIN', 'MANAGER'), validate(createLeadSchema), createLead)
router.patch('/:id/status', protect, updateLeadStatus)
router.patch('/:id/assign', protect, allowRoles('ADMIN', 'MANAGER'), assignLead)
router.post('/:id/score', protect, scoreLead)
router.post('/:id/generate-email', protect, generateEmail)
router.post('/:id/send-email', protect, sendEmailToLead)
router.get('/:id/email-history', protect, getEmailHistory)
router.delete('/:id', protect, allowRoles('ADMIN', 'MANAGER'), deleteLead)

module.exports = router