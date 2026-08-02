const prisma = require('../config/db')

const getNextAssignee = async () => {
  const salesExecs = await prisma.user.findMany({
    where: { role: 'SALES_EXEC' },
    orderBy: { createdAt: 'asc' }
  })

  if (salesExecs.length === 0) return null

  const lastAssignedLead = await prisma.lead.findFirst({
    where: { assignedToId: { not: null } },
    orderBy: { updatedAt: 'desc' }
  })

  if (!lastAssignedLead) {
    return salesExecs[0].id
  }

  const lastIndex = salesExecs.findIndex(exec => exec.id === lastAssignedLead.assignedToId)

  if (lastIndex === -1) {
    return salesExecs[0].id
  }

  const nextIndex = (lastIndex + 1) % salesExecs.length
  return salesExecs[nextIndex].id
}

module.exports = { getNextAssignee }
