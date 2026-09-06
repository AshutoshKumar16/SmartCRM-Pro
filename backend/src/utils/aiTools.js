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

// --- NEW FUNCTIONS (Phase 1) ---

const getEmployeeCount = async (role) => {
  if (role === 'SALES_EXEC') {
    return { restricted: true, message: 'This information is only available to Admin and Manager roles.' }
  }

  const total = await prisma.user.count()
  const byRole = await prisma.user.groupBy({
    by: ['role'],
    _count: true
  })
  return { total, byRole }
}

const getEmployeeList = async (role) => {
  if (role === 'SALES_EXEC') {
    return { restricted: true, message: 'This information is only available to Admin and Manager roles.' }
  }

  const employees = await prisma.user.findMany({
    select: { name: true, email: true, role: true, employeeCode: true },
    orderBy: { createdAt: 'asc' }
  })
  return { count: employees.length, employees }
}

const getOverdueTasks = async (role, userId) => {
  const now = new Date()
  const where = role === 'SALES_EXEC'
    ? { assignedToId: userId, status: { not: 'DONE' }, dueDate: { lt: now } }
    : { status: { not: 'DONE' }, dueDate: { lt: now } }

  const tasks = await prisma.task.findMany({
    where,
    select: { title: true, dueDate: true, priority: true, assignedTo: { select: { name: true } } }
  })
  return { count: tasks.length, tasks }
}

const getCustomerHealth = async (role, userId) => {
  const where = role === 'SALES_EXEC' ? { lead: { assignedToId: userId } } : {}
  const customers = await prisma.customer.findMany({ where, select: { companyName: true, healthScore: true } })

  const healthy = customers.filter(c => c.healthScore >= 70).length
  const atRisk = customers.filter(c => c.healthScore >= 40 && c.healthScore < 70).length
  const critical = customers.filter(c => c.healthScore < 40).length

  return { total: customers.length, healthy, atRisk, critical }
}

const getUnassignedLeads = async (role) => {
  if (role === 'SALES_EXEC') {
    return { restricted: true, message: 'This information is only available to Admin and Manager roles.' }
  }

  const leads = await prisma.lead.findMany({
    where: { assignedToId: null },
    select: { name: true, company: true, status: true, createdAt: true }
  })
  return { count: leads.length, leads }
}

const getFullLeaderboard = async (role) => {
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

  const ranked = employees.map(emp => {
    const total = emp.leads.length
    const won = emp.leads.filter(l => l.status === 'WON').length
    return {
      name: emp.name,
      totalLeads: total,
      wonLeads: won,
      conversionRate: total > 0 ? Math.round((won / total) * 100) : 0
    }
  }).sort((a, b) => b.wonLeads - a.wonLeads)

  return { leaderboard: ranked }
}

module.exports = {
  getTotalLeads,
  getRevenue,
  getTopPerformer,
  getHotLeads,
  getTodayMeetings,
  getPendingTasks,
  getEmployeeCount,
  getEmployeeList,
  getOverdueTasks,
  getCustomerHealth,
  getUnassignedLeads,
  getFullLeaderboard
}