const { GoogleGenAI } = require('@google/genai')

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

const generateFollowUpEmail = async (lead, senderName) => {
  try {
    const prompt = `You are writing a professional follow-up email on behalf of ${senderName}, a sales executive at a software/web development agency in India.

Write a concise, friendly, professional follow-up email to this lead:

Name: ${lead.name}
Company: ${lead.company || 'Not provided'}
Current status: ${lead.status}
Budget: ${lead.budget || 'Not discussed yet'}
Their message: ${lead.message || 'No message provided'}

Guidelines:
- Keep the body under 120 words
- Be warm but professional, not pushy
- Reference their specific need if mentioned in their message
- End with a clear call to action (e.g., suggest a call or meeting)
- Sign off with "${senderName}"

Return ONLY a JSON object with this exact structure, no markdown, no extra text:
{"subject": "<short subject line>", "body": "<email body text>"}`

    const result = await ai.models.generateContent({
      model: 'gemini-flash-lite-latest',
      contents: [{ role: 'user', parts: [{ text: prompt }] }]
    })

    const text = result.text.trim()
    const cleaned = text.replace(/```json\n?|```/g, '').trim()
    const parsed = JSON.parse(cleaned)

    return { success: true, subject: parsed.subject, body: parsed.body }
  } catch (err) {
    console.error('Email generation failed:', err.message)
    return { success: false, error: 'Could not generate email. Please try again.' }
  }
}

module.exports = { generateFollowUpEmail }