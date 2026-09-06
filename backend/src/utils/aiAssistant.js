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
    description: 'Get the single top performing sales executive based on number of won deals. Only available to Admin and Manager roles.',
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
  {
    name: 'getEmployeeCount',
    description: 'Get the total number of employees in the system and breakdown by role (ADMIN, MANAGER, SALES_EXEC). Only available to Admin and Manager roles.',
  },
  {
    name: 'getEmployeeList',
    description: 'Get a list of all employees with their name, email, role, and employee code. Use this to look up a specific employee by name or code. Only available to Admin and Manager roles.',
  },
  {
    name: 'getOverdueTasks',
    description: 'Get tasks that are past their due date and not yet completed',
  },
  {
    name: 'getCustomerHealth',
    description: 'Get a breakdown of customers by health status: healthy, at-risk, or critical',
  },
  {
    name: 'getUnassignedLeads',
    description: 'Get leads that have not been assigned to any sales executive. Only available to Admin and Manager roles.',
  },
  {
    name: 'getFullLeaderboard',
    description: 'Get the complete ranking of all sales executives with their total leads, won leads, and conversion rate. Only available to Admin and Manager roles.',
  },
]

const toolFunctionMap = {
  getTotalLeads: tools.getTotalLeads,
  getRevenue: tools.getRevenue,
  getTopPerformer: tools.getTopPerformer,
  getHotLeads: tools.getHotLeads,
  getTodayMeetings: tools.getTodayMeetings,
  getPendingTasks: tools.getPendingTasks,
  getEmployeeCount: tools.getEmployeeCount,
  getEmployeeList: tools.getEmployeeList,
  getOverdueTasks: tools.getOverdueTasks,
  getCustomerHealth: tools.getCustomerHealth,
  getUnassignedLeads: tools.getUnassignedLeads,
  getFullLeaderboard: tools.getFullLeaderboard,
}

const SYSTEM_INSTRUCTION = 'You are a CRM assistant for an Indian software/web development agency. All monetary values in this system are in Indian Rupees (INR). Always use the ₹ symbol when mentioning any money or revenue figures, never use $ or USD or any other currency symbol. Always respond with a clear final text answer after using any tools.'

const askAssistant = async (userMessage, role, userId) => {
  try {
    const contents = [{ role: 'user', parts: [{ text: userMessage }] }]
    const maxRounds = 5

    for (let i = 0; i < maxRounds; i++) {
      const result = await ai.models.generateContent({
        model: 'gemini-flash-lite-latest',
        contents,
        config: {
          tools: [{ functionDeclarations }],
          systemInstruction: SYSTEM_INSTRUCTION
        }
      })

      const candidate = result.candidates[0]
      const functionCallPart = candidate.content.parts.find(p => p.functionCall)

      if (!functionCallPart) {
        const text = result.text
        if (text && text.trim().length > 0) {
          return { reply: text }
        }
        return { reply: "I couldn't find a clear answer for that. Could you rephrase your question?" }
      }

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
    }

    return { reply: "I wasn't able to fully process that request. Please try asking in a simpler way." }
  } catch (err) {
    console.error('AI Assistant error:', err.message)
    return { reply: "Sorry, I'm having trouble processing that request right now. Please try again." }
  }
}

module.exports = { askAssistant }