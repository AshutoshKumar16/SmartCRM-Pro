const prisma = require('../config/db')

const getActivityLogs = async (req, res, next) => {
  try {
    const logs = await prisma.activityLog.findMany({
      include: {
        user: { select: { name: true, role: true } }
      },
      orderBy: { createdAt: 'desc' },
      take: 100
    })
    res.json(logs)
  } catch (err) {
    next(err)
  }
}

module.exports = { getActivityLogs }
