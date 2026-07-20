const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const cookieParser = require('cookie-parser')
const dotenv = require('dotenv')
const errorHandler = require('./middleware/errorHandler')
dotenv.config()
const { startCronJobs } = require('./utils/cronJobs')

const app = express()

// Middleware
app.use(helmet())
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))
app.use(express.json())
app.use(cookieParser())

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
})
app.use(limiter)

// Routes
const authRoutes = require('./routes/auth.routes')
app.use('/api/auth', authRoutes)
const leadRoutes = require('./routes/lead.routes')
app.use('/api/leads', leadRoutes)

const customerRoutes = require('./routes/customer.routes')
app.use('/api/customers', customerRoutes)

const taskRoutes = require('./routes/task.routes')
app.use('/api/tasks', taskRoutes)

const meetingRoutes = require('./routes/meeting.routes')
app.use('/api/meetings', meetingRoutes)

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'SmartCRM Pro API is running!' })
})

// ... saari routes ...
app.use('/api/leads', leadRoutes)
app.use('/api/auth', authRoutes)
// ... etc

app.use(errorHandler)   // ← routes ke baad, listen se pehle

app.listen(5000, () => {
  console.log('Server running on port 5000')
})

// Start server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  startCronJobs()
})
})