const prisma = require('../config/db')

const getEmployees = async (req, res, next) => {
  try {
    const employees = await prisma.user.findMany({
      select: {
        id: true,
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

module.exports = { getEmployees }
