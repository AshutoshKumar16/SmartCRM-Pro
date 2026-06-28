const prisma = require('../config/db')

const getMeetings = async (req, res) => {
  try {
    const meetings = await prisma.meeting.findMany({
      include: {
        lead: { select: { id: true, name: true } },
        customer: { select: { id: true, companyName: true } }
      },
      orderBy: { scheduledAt: 'asc' }
    })
    res.json(meetings)
  } catch {
    res.status(500).json({ message: 'Server error' })
  }
}

const createMeeting = async (req, res) => {
  try {
    const { title, leadId, customerId, scheduledAt, notes } = req.body
    if (!title || !scheduledAt) return res.status(400).json({ message: 'Title and date required' })
    const meeting = await prisma.meeting.create({
      data: {
        title,
        leadId: leadId || null,
        customerId: customerId || null,
        scheduledAt: new Date(scheduledAt),
        notes,
        status: 'SCHEDULED'
      }
    })
    res.status(201).json(meeting)
  } catch {
    res.status(500).json({ message: 'Server error' })
  }
}

const updateMeeting = async (req, res) => {
  try {
    const meeting = await prisma.meeting.update({
      where: { id: req.params.id },
      data: req.body
    })
    res.json(meeting)
  } catch {
    res.status(500).json({ message: 'Server error' })
  }
}

const deleteMeeting = async (req, res) => {
  try {
    await prisma.meeting.delete({ where: { id: req.params.id } })
    res.json({ message: 'Meeting deleted' })
  } catch {
    res.status(500).json({ message: 'Server error' })
  }
}

module.exports = { getMeetings, createMeeting, updateMeeting, deleteMeeting }