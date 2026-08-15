const { z } = require('zod')

const createMeetingSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  leadId: z.string().optional(),
  customerId: z.string().optional(),
  scheduledAt: z.string().min(1, 'Scheduled date is required'),
  notes: z.string().optional()
})

module.exports = { createMeetingSchema }
