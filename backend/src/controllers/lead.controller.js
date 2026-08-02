const prisma = require('../config/db')
const { sendLeadAssignedEmail } = require('../utils/emailService')
const { getNextAssignee } = require('../utils/autoAssign')

// Public route — website se lead create
const createPublicLead = async (req, res, next) => {
  try {
    const { name, email, phone, company, budget, message } = req.body
    if (!name || !email) return res.status(400).json({ message: 'Name and email required' })

    const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } })
    if (!admin) return res.status(500).json({ message: 'No admin found' })

    const assignedToId = await getNextAssignee()

    const lead = await prisma.lead.create({
      data: {
        name, email, phone, company, budget,
        source: 'WEBSITE',
        status: 'NEW',
        createdById: admin.id,
        assignedToId: assignedToId || null
      },
      include: {
        assignedTo: { select: { id: true, name: true, email: true } }
      }
    })

    if (lead.assignedTo?.email) {
      await sendLeadAssignedEmail(lead, lead.assignedTo)
    }

    res.status(201).json({ message: 'Enquiry submitted successfully', lead })
  } catch (err) {
    next(err)
  }
}

// Get all leads — role based
const getLeads = async (req, res, next) => {
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
    next(err)
  }
}

// Create lead — from CRM
const createLead = async (req, res, next) => {
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
    next(err)
  }
}

// Update lead status
const updateLeadStatus = async (req, res, next) => {
  try {
    const { id } = req.params
    const { status } = req.body

    const lead = await prisma.lead.update({
      where: { id },
      data: { status }
    })
    res.json(lead)
  } catch (err) {
    next(err)
  }
}

// Assign lead
const assignLead = async (req, res, next) => {
  try {
    const { id } = req.params
    const { assignedToId } = req.body

    const lead = await prisma.lead.update({
      where: { id },
      data: { assignedToId },
      include: {
        assignedTo: { select: { id: true, name: true, email: true, role: true } }
      }
    })

    if (lead.assignedTo?.email) {
      await sendLeadAssignedEmail(lead, lead.assignedTo)
    }

    res.json(lead)
  } catch (err) {
    next(err)
  }
}

// Delete lead
const deleteLead = async (req, res, next) => {
  try {
    const { id } = req.params
    await prisma.lead.delete({ where: { id } })
    res.json({ message: 'Lead deleted' })
  } catch (err) {
    next(err)
  }
}

module.exports = { createPublicLead, getLeads, createLead, updateLeadStatus, assignLead, deleteLead }