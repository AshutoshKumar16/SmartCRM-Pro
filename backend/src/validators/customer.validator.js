const { z } = require('zod')

const convertLeadSchema = z.object({
  leadId: z.string().min(1, 'Lead ID is required'),
  companyName: z.string().min(2, 'Company name must be at least 2 characters'),
  projectName: z.string().optional(),
  totalValue: z.number().optional()
})

module.exports = { convertLeadSchema }
