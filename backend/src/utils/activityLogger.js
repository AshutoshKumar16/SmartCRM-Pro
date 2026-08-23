const prisma = require('../config/db')

const logActivity = async (userId, action, entityType = null, entityId = null, metadata = null) => {
  try {
    await prisma.activityLog.create({
      data: { userId, action, entityType, entityId, metadata }
    })
  } catch (err) {
    console.error('Failed to log activity:', err.message)
  }
}

module.exports = { logActivity }
