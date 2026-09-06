const prisma = require('../config/db')

const getTotalLeads = async (role, userId) => {
  const where = role === 'SALES_EXEC' ? { assignedToId: userId } : {}
  const total = await prisma.lead.count({ where })
  const byStatus = await prisma.lead.groupBy({
    by: ['status'],
    where,
    _count: true
  })
  return { total, byStatus }
}

const getRevenue = async (role, userId) => {
  const where = role === 'SALES_EXEC' ? { lead: { assignedToId: userId } } : {}
  const customers = await prisma.customer.findMany({ where, select: { totalValue: true } })
  const totalRevenue = customers.reduce((sum, c) => sum + c.totalValue, 0)
  return { totalRevenue, totalCustomers: customers.length }
}

const getTopPerformer = async (role) => {
  if (role === 'SALES_EXEC') {
    return { restricted: true, message: 'This information is only available to Admin and Manager roles.' }
  }

  const employees = await prisma.user.findMany({
    where: { role: 'SALES_EXEC' },
    select: {
      name: true,
      leads: { select: { status: true } }
    }
  })

  const ranked = employees.map(emp => ({
    name: emp.name,
    totalLeads: emp.leads.length,
    wonLeads: emp.leads.filter(l => l.status === 'WON').length
  })).sort((a, b) => b.wonLeads - a.wonLeads)

  return ranked[0] || { name: 'No data', wonLeads: 0 }
}

const getHotLeads = async (role, userId) => {
  const where = role === 'SALES_EXEC'
    ? { score: { gte: 70 }, assignedToId: userId }
    : { score: { gte: 70 } }

  const leads = await prisma.lead.findMany({
    where,
    select: { name: true, company: true, score: true, status: true },
    orderBy: { score: 'desc' },
    take: 10
  })
  return { count: leads.length, leads }
}

const getTodayMeetings = async (role, userId) => {
  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)
  const todayEnd = new Date()
  todayEnd.setHours(23, 59, 59, 999)

  const where = role === 'SALES_EXEC'
    ? {
        scheduledAt: { gte: todayStart, lte: todayEnd },
        OR: [
          { lead: { assignedToId: userId } },
          { customer: { lead: { assignedToId: userId } } }
        ]
      }
    : { scheduledAt: { gte: todayStart, lte: todayEnd } }

  const meetings = await prisma.meeting.findMany({
    where,
    select: { title: true, scheduledAt: true, status: true }
  })
  return { count: meetings.length, meetings }
}

const getPendingTasks = async (role, userId) => {
  const where = role === 'SALES_EXEC'
    ? { assignedToId: userId, status: { not: 'DONE' } }
    : { status: { not: 'DONE' } }

  const count = await prisma.task.count({ where })
  return { count }
}

module.exports = {
  getTotalLeads,
  getRevenue,
  getTopPerformer,
  getHotLeads,
  getTodayMeetings,
  getPendingTasks
}