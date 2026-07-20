const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  }
})

const sendEmail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({
      from: `"SmartCRM Pro" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    })
    console.log(`Email sent to ${to}`)
  } catch (err) {
    console.error('Email error:', err)
  }
}

const sendMeetingReminder = async (meeting, email, name) => {
  await sendEmail({
    to: email,
    subject: `Meeting Reminder: ${meeting.title}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1a56db; padding: 20px; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 20px;">SmartCRM Pro</h1>
        </div>
        <div style="padding: 24px; background: #f8f9fc; border-radius: 0 0 8px 8px;">
          <h2 style="color: #111827;">Meeting Reminder</h2>
          <p style="color: #6b7280;">Hi ${name},</p>
          <p style="color: #6b7280;">You have a meeting scheduled for tomorrow:</p>
          <div style="background: white; padding: 16px; border-radius: 8px; border-left: 4px solid #1a56db; margin: 16px 0;">
            <p style="margin: 0; font-weight: bold; color: #111827;">${meeting.title}</p>
            <p style="margin: 4px 0 0; color: #6b7280;">📅 ${new Date(meeting.scheduledAt).toLocaleString('en-IN', { dateStyle: 'full', timeStyle: 'short' })}</p>
            ${meeting.notes ? `<p style="margin: 4px 0 0; color: #6b7280;">📝 ${meeting.notes}</p>` : ''}
          </div>
          <p style="color: #6b7280;">Please be prepared and on time.</p>
          <p style="color: #9ca3af; font-size: 12px; margin-top: 24px;">This is an automated reminder from SmartCRM Pro.</p>
        </div>
      </div>
    `
  })
}

const sendTaskOverdueAlert = async (task, email, name) => {
  await sendEmail({
    to: email,
    subject: `Task Overdue: ${task.title}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #ef4444; padding: 20px; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 20px;">SmartCRM Pro</h1>
        </div>
        <div style="padding: 24px; background: #f8f9fc; border-radius: 0 0 8px 8px;">
          <h2 style="color: #111827;">Task Overdue Alert</h2>
          <p style="color: #6b7280;">Hi ${name},</p>
          <p style="color: #6b7280;">The following task is overdue:</p>
          <div style="background: white; padding: 16px; border-radius: 8px; border-left: 4px solid #ef4444; margin: 16px 0;">
            <p style="margin: 0; font-weight: bold; color: #111827;">${task.title}</p>
            <p style="margin: 4px 0 0; color: #6b7280;">Priority: ${task.priority}</p>
            ${task.dueDate ? `<p style="margin: 4px 0 0; color: #ef4444;">Due: ${new Date(task.dueDate).toLocaleDateString('en-IN')}</p>` : ''}
          </div>
          <p style="color: #6b7280;">Please complete this task as soon as possible.</p>
          <p style="color: #9ca3af; font-size: 12px; margin-top: 24px;">This is an automated alert from SmartCRM Pro.</p>
        </div>
      </div>
    `
  })
}

const sendLeadAssignedEmail = async (lead, assignedTo) => {
  await sendEmail({
    to: assignedTo.email,
    subject: `New Lead Assigned: ${lead.name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1a56db; padding: 20px; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 20px;">SmartCRM Pro</h1>
        </div>
        <div style="padding: 24px; background: #f8f9fc; border-radius: 0 0 8px 8px;">
          <h2 style="color: #111827;">New Lead Assigned to You</h2>
          <p style="color: #6b7280;">Hi ${assignedTo.name},</p>
          <p style="color: #6b7280;">A new lead has been assigned to you:</p>
          <div style="background: white; padding: 16px; border-radius: 8px; border-left: 4px solid #1a56db; margin: 16px 0;">
            <p style="margin: 0; font-weight: bold; color: #111827;">${lead.name}</p>
            <p style="margin: 4px 0 0; color: #6b7280;">📧 ${lead.email}</p>
            ${lead.company ? `<p style="margin: 4px 0 0; color: #6b7280;">🏢 ${lead.company}</p>` : ''}
            ${lead.budget ? `<p style="margin: 4px 0 0; color: #6b7280;">💰 ${lead.budget}</p>` : ''}
          </div>
          <p style="color: #6b7280;">Please follow up with this lead as soon as possible.</p>
          <p style="color: #9ca3af; font-size: 12px; margin-top: 24px;">This is an automated notification from SmartCRM Pro.</p>
        </div>
      </div>
    `
  })
}

module.exports = { sendEmail, sendMeetingReminder, sendTaskOverdueAlert, sendLeadAssignedEmail }