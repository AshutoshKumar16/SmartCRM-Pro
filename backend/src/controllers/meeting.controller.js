const prisma = require('../config/db')

const getMeetings = async (req, res, next) => {
  try {
    const meetings = await prisma.meeting.findMany({
      include: {
        lead: { select: { id: true, name: true } },
        customer: { select: { id: true, companyName: true } }
      },
      orderBy: { scheduledAt: 'asc' }
    })
    res.json(meetings)
  } catch (err) {
    next(err)
  }
}

const createMeeting = async (req, res, next) => {
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
  } catch (err) {
    next(err)
  }
}

const updateMeeting = async (req, res, next) => {
  try {
    const meeting = await prisma.meeting.update({
      where: { id: req.params.id },
      data: req.body
    })
    res.json(meeting)
  } catch (err) {
    next(err)
  }
}

const deleteMeeting = async (req, res, next) => {
  try {
    await prisma.meeting.delete({ where: { id: req.params.id } })
    res.json({ message: 'Meeting deleted' })
  } catch (err) {
    next(err)
  }
}

module.exports = { getMeetings, createMeeting, updateMeeting, deleteMeeting }