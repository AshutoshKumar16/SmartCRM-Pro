const { generateFollowUpEmail } = require('../utils/aiEmailGenerator')
const { scoreLeadWithAI } = require('../utils/aiScoring')
const prisma = require('../config/db')
const { sendLeadAssignedEmail, sendCustomEmailToLead } = require('../utils/emailService')
const { getNextAssignee } = require('../utils/autoAssign')
const { logActivity } = require('../utils/activityLogger')
const { createNotification } = require('../utils/notify')

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
        name, email, phone, company, budget, message,
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

    if (lead.assignedTo?.id) {
      await createNotification(lead.assignedTo.id, `New lead assigned: ${lead.name}`, 'LEAD_ASSIGNED')
    }

    scoreLeadWithAI(lead).then(aiResult => {
      prisma.lead.update({ where: { id: lead.id }, data: { score: aiResult.score } }).catch(console.error)
    }).catch(console.error)

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

    const finalAssignedToId = assignedToId || await getNextAssignee()

    const lead = await prisma.lead.create({
      data: {
        name, email, phone, company, budget,
        source: source || 'MANUAL',
        status: 'NEW',
        createdById: req.user.id,
        assignedToId: finalAssignedToId || null
      },
      include: {
        assignedTo: { select: { id: true, name: true, email: true } }
      }
    })

    if (lead.assignedTo?.email) {
      await sendLeadAssignedEmail(lead, lead.assignedTo)
    }

    if (lead.assignedTo?.id) {
      await createNotification(lead.assignedTo.id, `New lead assigned: ${lead.name}`, 'LEAD_ASSIGNED')
    }

    await logActivity(req.user.id, `Created a new lead: ${lead.name}`, 'Lead', lead.id)

    scoreLeadWithAI(lead).then(aiResult => {
      prisma.lead.update({ where: { id: lead.id }, data: { score: aiResult.score } }).catch(console.error)
    }).catch(console.error)

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

    await logActivity(req.user.id, `Changed lead status to ${status}`, 'Lead', lead.id, { name: lead.name, status })

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

    if (lead.assignedTo?.id) {
      await createNotification(lead.assignedTo.id, `New lead assigned: ${lead.name}`, 'LEAD_ASSIGNED')
    }

    await logActivity(req.user.id, `Assigned lead "${lead.name}" to ${lead.assignedTo?.name}`, 'Lead', lead.id)

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

    await logActivity(req.user.id, `Deleted a lead`, 'Lead', id)

    res.json({ message: 'Lead deleted' })
  } catch (err) {
    next(err)
  }
}

// AI Score a lead
const scoreLead = async (req, res, next) => {
  try {
    const { id } = req.params

    const lead = await prisma.lead.findUnique({ where: { id } })
    if (!lead) return res.status(404).json({ message: 'Lead not found' })

    const aiResult = await scoreLeadWithAI(lead)

    const updatedLead = await prisma.lead.update({
      where: { id },
      data: { score: aiResult.score }
    })

    res.json({
      lead: updatedLead,
      label: aiResult.label,
      reasoning: aiResult.reasoning
    })
  } catch (err) {
    next(err)
  }
}

// AI Generate follow-up email (draft only, not sent)
const generateEmail = async (req, res, next) => {
  try {
    const { id } = req.params

    const lead = await prisma.lead.findUnique({ where: { id } })
    if (!lead) return res.status(404).json({ message: 'Lead not found' })

    const currentUser = await prisma.user.findUnique({ where: { id: req.user.id }, select: { name: true } })

    const result = await generateFollowUpEmail(lead, currentUser?.name || 'Our Team')

    if (!result.success) {
      return res.status(500).json({ message: result.error })
    }

    res.json({ subject: result.subject, body: result.body })
  } catch (err) {
    next(err)
  }
}

// Send a (possibly edited) email to the lead
const sendEmailToLead = async (req, res, next) => {
  try {
    const { id } = req.params
    const { subject, body } = req.body

    if (!subject || !body) {
      return res.status(400).json({ message: 'Subject and body are required' })
    }

    const lead = await prisma.lead.findUnique({ where: { id } })
    if (!lead) return res.status(404).json({ message: 'Lead not found' })

    const currentUser = await prisma.user.findUnique({ where: { id: req.user.id }, select: { name: true } })

    await sendCustomEmailToLead(lead, subject, body)

    await prisma.emailLog.create({
      data: {
        leadId: lead.id,
        subject,
        body,
        sentBy: currentUser?.name || 'Unknown'
      }
    })

    await logActivity(req.user.id, `Sent a follow-up email to ${lead.name}`, 'Lead', lead.id)

    res.json({ message: 'Email sent successfully' })
  } catch (err) {
    next(err)
  }
}
// Get email history for a lead
const getEmailHistory = async (req, res, next) => {
  try {
    const { id } = req.params

    const logs = await prisma.emailLog.findMany({
      where: { leadId: id },
      orderBy: { sentAt: 'desc' }
    })

    res.json(logs)
  } catch (err) {
    next(err)
  }
}
module.exports = { createPublicLead, getLeads, createLead, updateLeadStatus, assignLead, deleteLead, scoreLead, generateEmail, sendEmailToLead, getEmailHistory }