const { z } = require('zod')

const createLeadSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  phone: z.string().optional(),
  company: z.string().optional(),
  budget: z.number().positive('Budget must be positive').optional(),
  source: z.string().optional(),
  assignedToId: z.string().optional()
})

module.exports = { createLeadSchema }
