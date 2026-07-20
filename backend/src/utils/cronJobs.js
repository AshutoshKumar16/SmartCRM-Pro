const cron = require('node-cron')
const prisma = require('../config/db')
const { sendMeetingReminder, sendTaskOverdueAlert } = require('./emailService')

const startCronJobs = () => {

  // Meeting reminder — runs every day at 9 AM
  cron.schedule('0 9 * * *', async () => {
    console.log('Running meeting reminder job...')
    try {
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      tomorrow.setHours(0, 0, 0, 0)

      const dayAfter = new Date(tomorrow)
      dayAfter.setDate(dayAfter.getDate() + 1)

      const meetings = await prisma.meeting.findMany({
        where: {
          scheduledAt: { gte: tomorrow, lt: dayAfter },
          status: 'SCHEDULED'
        },
        include: {
          lead: { include: { assignedTo: true } }
        }
      })

      for (const meeting of meetings) {
        const user = meeting.lead?.assignedTo
        if (user?.email) {
          await sendMeetingReminder(meeting, user.email, user.name)
        }
      }
      console.log(`Meeting reminders sent: ${meetings.length}`)
    } catch (err) {
      console.error('Meeting reminder job error:', err)
    }
  })

  // Task overdue alert — runs every day at 8 AM
  cron.schedule('0 8 * * *', async () => {
    console.log('Running task overdue job...')
    try {
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const overdueTasks = await prisma.task.findMany({
        where: {
          dueDate: { lt: today },
          status: { not: 'DONE' }
        },
        include: {
          assignedTo: true
        }
      })

      for (const task of overdueTasks) {
        const user = task.assignedTo
        if (user?.email) {
          await sendTaskOverdueAlert(task, user.email, user.name)
        }
      }
      console.log(`Overdue alerts sent: ${overdueTasks.length}`)
    } catch (err) {
      console.error('Task overdue job error:', err)
    }
  })

  console.log('Cron jobs started!')
}

module.exports = { startCronJobs }