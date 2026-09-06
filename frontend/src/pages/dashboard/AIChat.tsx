import { useState, useRef, useEffect } from 'react'
import api from '../../lib/axios'
import { Sparkles, X, Send, Loader2 } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  text: string
}

export default function AIChat({ dark }: { dark: boolean }) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', text: "Hi! I'm your CRM assistant. Ask me about your leads, revenue, meetings, or tasks." }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const d = dark

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isOpen])

  const handleSend = async () => {
    if (!input.trim() || loading) return

    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', text: userMessage }])
    setLoading(true)

    try {
      const res = await api.post('/assistant/chat', { message: userMessage })
      setMessages(prev => [...prev, { role: 'assistant', text: res.data.reply }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', text: "Sorry, something went wrong. Please try again." }])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      {/* Floating button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-brand-600 hover:bg-brand-700 text-white flex items-center justify-center shadow-lg transition-all hover:scale-105 z-40"
        >
          <Sparkles className="w-6 h-6" />
        </button>
      )}

      {/* Chat window */}
      {isOpen && (
        <div className={`fixed bottom-6 right-6 w-96 h-[560px] rounded-2xl border shadow-2xl flex flex-col z-40 ${d ? 'bg-ink-900 border-ink-800' : 'bg-white border-ink-200'}`}>

          {/* Header */}
          <div className={`flex items-center justify-between px-5 py-4 border-b ${d ? 'border-ink-800' : 'border-ink-100'}`}>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className={`text-sm font-semibold ${d ? 'text-white' : 'text-ink-900'}`}>AI Assistant</div>
                <div className="text-[10px] text-ink-400">Ask about your CRM data</div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-ink-400 hover:text-ink-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm whitespace-pre-wrap ${
                    msg.role === 'user'
                      ? 'bg-brand-600 text-white rounded-br-sm'
                      : d
                      ? 'bg-ink-800 text-ink-200 rounded-bl-sm'
                      : 'bg-ink-50 text-ink-700 rounded-bl-sm'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className={`px-3.5 py-2.5 rounded-2xl rounded-bl-sm flex items-center gap-2 ${d ? 'bg-ink-800' : 'bg-ink-50'}`}>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-600" />
                  <span className={`text-xs ${d ? 'text-ink-400' : 'text-ink-500'}`}>Thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className={`p-3 border-t ${d ? 'border-ink-800' : 'border-ink-100'}`}>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Ask about leads, revenue, tasks..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={loading}
                className={`flex-1 px-3.5 py-2.5 rounded-xl text-sm outline-none border ${d ? 'bg-ink-800 border-ink-700 text-white placeholder-ink-500' : 'bg-ink-50 border-ink-200 text-ink-900'}`}
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="w-10 h-10 rounded-xl bg-brand-600 hover:bg-brand-700 text-white flex items-center justify-center transition disabled:opacity-40 flex-shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}