const { askAssistant } = require('../utils/aiAssistant')

const chatWithAssistant = async (req, res, next) => {
  try {
    const { message } = req.body
    if (!message || message.trim().length === 0) {
      return res.status(400).json({ message: 'Message is required' })
    }

    const { role, id } = req.user
    const result = await askAssistant(message, role, id)

    res.json(result)
  } catch (err) {
    next(err)
  }
}

module.exports = { chatWithAssistant }