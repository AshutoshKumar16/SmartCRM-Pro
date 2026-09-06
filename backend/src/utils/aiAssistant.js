const { GoogleGenAI } = require('@google/genai')
const tools = require('./aiTools')

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

const functionDeclarations = [
  {
    name: 'getTotalLeads',
    description: 'Get the total number of leads and breakdown by status (NEW, CONTACTED, MEETING, PROPOSAL, WON, LOST)',
  },
  {
    name: 'getRevenue',
    description: 'Get total revenue from all converted customers and total customer count',
  },
  {
    name: 'getTopPerformer',
    description: 'Get the top performing sales executive based on number of won deals. Only available to Admin and Manager roles.',
  },
  {
    name: 'getHotLeads',
    description: 'Get leads with a high AI score (70 or above), considered hot/high-priority leads',
  },
  {
    name: 'getTodayMeetings',
    description: 'Get all meetings scheduled for today',
  },
  {
    name: 'getPendingTasks',
    description: 'Get the count of tasks that are not yet completed',
  },
]

const toolFunctionMap = {
  getTotalLeads: tools.getTotalLeads,
  getRevenue: tools.getRevenue,
  getTopPerformer: tools.getTopPerformer,
  getHotLeads: tools.getHotLeads,
  getTodayMeetings: tools.getTodayMeetings,
  getPendingTasks: tools.getPendingTasks,
}

const SYSTEM_INSTRUCTION = 'You are a CRM assistant for an Indian software/web development agency. All monetary values in this system are in Indian Rupees (INR). Always use the ₹ symbol when mentioning any money or revenue figures, never use $ or USD or any other currency symbol.'

const askAssistant = async (userMessage, role, userId) => {
  try {
    const contents = [{ role: 'user', parts: [{ text: userMessage }] }]

    const result = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents,
      config: {
        tools: [{ functionDeclarations }],
        systemInstruction: SYSTEM_INSTRUCTION
      }
    })

    const candidate = result.candidates[0]
    const functionCallPart = candidate.content.parts.find(p => p.functionCall)

    if (functionCallPart) {
      const call = functionCallPart.functionCall
      const fn = toolFunctionMap[call.name]

      if (!fn) {
        return { reply: "I don't have access to that information right now." }
      }

      const functionResult = await fn(role, userId)

      contents.push(candidate.content)
      contents.push({
        role: 'user',
        parts: [{ functionResponse: { name: call.name, response: functionResult } }]
      })

      const followUp = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents,
        config: {
          tools: [{ functionDeclarations }],
          systemInstruction: SYSTEM_INSTRUCTION
        }
      })

      return { reply: followUp.text }
    }

    return { reply: result.text }
  } catch (err) {
    console.error('AI Assistant error:', err.message)
    return { reply: "Sorry, I'm having trouble processing that request right now. Please try again." }
  }
}

module.exports = { askAssistant }