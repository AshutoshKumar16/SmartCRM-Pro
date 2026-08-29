const prisma = require('../config/db')

const getDashboardStats = async (req, res, next) => {
  try {
    const { role, id } = req.user
    const leadWhere = role === 'SALES_EXEC' ? { assignedToId: id } : {}

    const totalLeads = await prisma.lead.count({ where: leadWhere })

    const wonLeads = await prisma.lead.count({ where: { ...leadWhere, status: 'WON' } })
    const conversionRate = totalLeads > 0 ? Math.round((wonLeads / totalLeads) * 100) : 0

    const customers = await prisma.customer.findMany({
      where: role === 'SALES_EXEC' ? { lead: { assignedToId: id } } : {},
      select: { totalValue: true }
    })
    const revenue = customers.reduce((sum, c) => sum + c.totalValue, 0)

    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)
    const todayEnd = new Date()
    todayEnd.setHours(23, 59, 59, 999)

    const meetingWhere = role === 'SALES_EXEC'
      ? { OR: [{ lead: { assignedToId: id } }, { customer: { lead: { assignedToId: id } } }] }
      : {}

    const meetingsToday = await prisma.meeting.count({
      where: { ...meetingWhere, scheduledAt: { gte: todayStart, lte: todayEnd } }
    })

    const recentLeads = await prisma.lead.findMany({
      where: leadWhere,
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { assignedTo: { select: { name: true } } }
    })

    const activeDeals = await prisma.lead.count({
      where: { ...leadWhere, status: { in: ['CONTACTED', 'MEETING', 'PROPOSAL'] } }
    })

    const upcomingMeetings = await prisma.meeting.count({
      where: { ...meetingWhere, status: 'SCHEDULED' }
    })

    const taskWhere = role === 'SALES_EXEC' ? { assignedToId: id } : {}
    const pendingTasks = await prisma.task.count({
      where: { ...taskWhere, status: { not: 'DONE' } }
    })

    res.json({
      totalLeads,
      conversionRate,
      revenue,
      meetingsToday,
      recentLeads,
      activeDeals,
      upcomingMeetings,
      pendingTasks
    })
  } catch (err) {
    next(err)
  }
}

module.exports = { getDashboardStats }
