const prisma = require('../config/db')

const getEmployees = async (req, res, next) => {
  try {
    const employees = await prisma.user.findMany({
      select: {
        id: true,
        employeeCode: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: {
          select: { leads: true, tasks: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    res.json(employees)
  } catch (err) {
    next(err)
  }
}

const getLeaderboard = async (req, res, next) => {
  try {
    const employees = await prisma.user.findMany({
      where: { role: 'SALES_EXEC' },
      select: {
        id: true,
        employeeCode: true,
        name: true,
        email: true,
        leads: {
          select: { status: true }
        }
      }
    })

    const leaderboard = employees.map(emp => {
      const totalLeads = emp.leads.length
      const wonLeads = emp.leads.filter(l => l.status === 'WON').length
      const conversionRate = totalLeads > 0 ? Math.round((wonLeads / totalLeads) * 100) : 0

      return {
        id: emp.id,
        employeeCode: emp.employeeCode,
        name: emp.name,
        email: emp.email,
        totalLeads,
        wonLeads,
        conversionRate
      }
    })

    leaderboard.sort((a, b) => b.wonLeads - a.wonLeads || b.conversionRate - a.conversionRate)

    res.json(leaderboard)
  } catch (err) {
    next(err)
  }
}

module.exports = { getEmployees, getLeaderboard }