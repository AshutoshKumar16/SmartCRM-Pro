const prisma = require('../config/db')
const { getIO } = require('./socket')

const createNotification = async (userId, message, type) => {
  try {
    const notification = await prisma.notification.create({
      data: { userId, message, type }
    })

    try {
      const io = getIO()
      io.to(userId).emit('notification', notification)
    } catch (socketErr) {
      console.error('Socket emit failed:', socketErr.message)
    }

    return notification
  } catch (err) {
    console.error('Failed to create notification:', err.message)
  }
}

module.exports = { createNotification }
