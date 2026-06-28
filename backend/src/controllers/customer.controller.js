const prisma = require('../config/db')

const getCustomers = async (req, res) => {
  try {
    const customers = await prisma.customer.findMany({
      include: {
        lead: { select: { name: true, email: true, phone: true } },
        payments: true,
      },
      orderBy: { createdAt: 'desc' }
    })
    res.json(customers)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
}

const convertLeadToCustomer = async (req, res) => {
  try {
    const { leadId, companyName, projectName, totalValue } = req.body

    const existing = await prisma.customer.findUnique({ where: { leadId } })
    if (existing) return res.status(400).json({ message: 'Lead already converted' })

    await prisma.lead.update({ where: { id: leadId }, data: { status: 'WON' } })

    const customer = await prisma.customer.create({
      data: { leadId, companyName, projectName, totalValue: totalValue || 0, healthScore: 100 }
    })

    res.status(201).json(customer)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
}

module.exports = { getCustomers, convertLeadToCustomer }