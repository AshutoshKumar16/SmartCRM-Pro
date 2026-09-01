const prisma = require('../config/db')

const getNotifications = async (req, res, next) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      take: 30
    })
    const unreadCount = await prisma.notification.count({
      where: { userId: req.user.id, isRead: false }
    })
    res.json({ notifications, unreadCount })
  } catch (err) {
    next(err)
  }
}

const markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params
    await prisma.notification.update({
      where: { id },
      data: { isRead: true }
    })
    res.json({ message: 'Marked as read' })
  } catch (err) {
    next(err)
  }
}

const markAllAsRead = async (req, res, next) => {
  try {
    await prisma.notification.updateMany({
      where: { userId: req.user.id, isRead: false },
      data: { isRead: true }
    })
    res.json({ message: 'All marked as read' })
  } catch (err) {
    next(err)
  }
}

module.exports = { getNotifications, markAsRead, markAllAsRead }
