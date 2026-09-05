const { GoogleGenerativeAI } = require('@google/generative-ai')

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

const scoreLeadWithAI = async (lead) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-3.6-flash' })

    const daysSinceCreated = Math.floor((Date.now() - new Date(lead.createdAt)) / (1000 * 60 * 60 * 24))

    const prompt = `You are a sales lead scoring assistant for a small software/web development agency.
Analyze this lead and return ONLY a JSON object (no markdown, no explanation) with this exact structure:
{"score": <number 0-100>, "label": "<Hot|Warm|Cold>", "reasoning": "<one short sentence>"}

Lead details:
Name: ${lead.name}
Company: ${lead.company || 'Not provided'}
Budget: ${lead.budget || 'Not provided'}
Status: ${lead.status}
Source: ${lead.source}
Message: ${lead.message || 'No message'}
Days since created: ${daysSinceCreated}

Scoring guide: Higher budget = higher score. Complete company info = higher score. Status closer to WON = higher score. Detailed message showing genuine interest = higher score. Score 80+ is Hot, 40-79 is Warm, below 40 is Cold.`

    const result = await model.generateContent(prompt)
    const text = result.response.text().trim()
    const cleaned = text.replace(/```json\n?|```/g, '').trim()
    return JSON.parse(cleaned)
  } catch (err) {
    console.error('AI scoring failed:', err.message)
    return { score: 0, label: 'Unknown', reasoning: 'AI scoring unavailable' }
  }
}

module.exports = { scoreLeadWithAI }