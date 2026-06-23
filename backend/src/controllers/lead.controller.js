const prisma = require('../config/db')

// Public route — website se lead create
const createPublicLead = async (req, res) => {
  try {
    const { name, email, phone, company, budget, message } = req.body
    if (!name || !email) return res.status(400).json({ message: 'Name and email required' })

    const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } })
    if (!admin) return res.status(500).json({ message: 'No admin found' })

    const lead = await prisma.lead.create({
      data: { name, email, phone, company, budget, source: 'WEBSITE', status: 'NEW', createdById: admin.id }
    })
    res.status(201).json({ message: 'Enquiry submitted successfully', lead })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

// Get all leads — role based
const getLeads = async (req, res) => {
  try {
    const { role, id } = req.user
    const where = role === 'SALES_EXEC' ? { assignedToId: id } : {}

    const leads = await prisma.lead.findMany({
      where,
      include: {
        assignedTo: { select: { id: true, name: true, email: true } },
        createdBy: { select: { id: true, name: true } }
      },
      orderBy: { createdAt: 'desc' }
    })
    res.json(leads)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
}

// Create lead — from CRM
const createLead = async (req, res) => {
  try {
    const { name, email, phone, company, budget, source, assignedToId } = req.body
    if (!name || !email) return res.status(400).json({ message: 'Name and email required' })

    const lead = await prisma.lead.create({
      data: {
        name, email, phone, company, budget,
        source: source || 'MANUAL',
        status: 'NEW',
        createdById: req.user.id,
        assignedToId: assignedToId || null
      }
    })
    res.status(201).json(lead)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
}

// Update lead status
const updateLeadStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body

    const lead = await prisma.lead.update({
      where: { id },
      data: { status }
    })
    res.json(lead)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
}

// Assign lead
const assignLead = async (req, res) => {
  try {
    const { id } = req.params
    const { assignedToId } = req.body

    const lead = await prisma.lead.update({
      where: { id },
      data: { assignedToId }
    })
    res.json(lead)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
}

// Delete lead
const deleteLead = async (req, res) => {
  try {
    const { id } = req.params
    await prisma.lead.delete({ where: { id } })
    res.json({ message: 'Lead deleted' })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
}

module.exports = { createPublicLead, getLeads, createLead, updateLeadStatus, assignLead, deleteLead }