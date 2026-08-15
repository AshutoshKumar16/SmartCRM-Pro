const { z } = require('zod')

const createTaskSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  description: z.string().optional(),
  assignedToId: z.string().optional(),
  leadId: z.string().optional(),
  priority: z.enum(['HIGH', 'MEDIUM', 'LOW']).optional(),
  dueDate: z.string().optional()
})

module.exports = { createTaskSchema }
