const prisma = require('../config/db')

const getTasks = async (req, res) => {
  try {
    const { role, id } = req.user
    const where = role === 'SALES_EXEC' ? { assignedToId: id } : {}
    const tasks = await prisma.task.findMany({
      where,
      include: {
        assignedTo: { select: { id: true, name: true } },
        lead: { select: { id: true, name: true } }
      },
      orderBy: { createdAt: 'desc' }
    })
    res.json(tasks)
  } catch {
    res.status(500).json({ message: 'Server error' })
  }
}

const createTask = async (req, res) => {
  try {
    const { title, description, assignedToId, leadId, priority, dueDate } = req.body
    if (!title) return res.status(400).json({ message: 'Title required' })
    const task = await prisma.task.create({
      data: {
        title,
        description,
        assignedToId: assignedToId || req.user.id,
        leadId: leadId || null,
        priority: priority || 'MEDIUM',
        status: 'PENDING',
        dueDate: dueDate ? new Date(dueDate) : null
      }
    })
    res.status(201).json(task)
  } catch {
    res.status(500).json({ message: 'Server error' })
  }
}

const updateTask = async (req, res) => {
  try {
    const { id } = req.params
    const task = await prisma.task.update({
      where: { id },
      data: req.body
    })
    res.json(task)
  } catch {
    res.status(500).json({ message: 'Server error' })
  }
}

const deleteTask = async (req, res) => {
  try {
    await prisma.task.delete({ where: { id: req.params.id } })
    res.json({ message: 'Task deleted' })
  } catch {
    res.status(500).json({ message: 'Server error' })
  }
}

module.exports = { getTasks, createTask, updateTask, deleteTask }