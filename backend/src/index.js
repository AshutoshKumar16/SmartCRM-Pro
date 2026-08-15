const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const cookieParser = require('cookie-parser')
const dotenv = require('dotenv')
const errorHandler = require('./middleware/errorHandler')
dotenv.config()
const { startCronJobs } = require('./utils/cronJobs')
const { setIO } = require('./utils/socket')

const app = express()
const server = http.createServer(app)

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    credentials: true
  }
})
setIO(io)

io.on('connection', (socket) => {
  console.log('User connected:', socket.id)

  socket.on('join', (userId) => {
    socket.join(userId)
    console.log(`User ${userId} joined their room`)
  })

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id)
  })
})

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
const leadRoutes = require('./routes/lead.routes')
const customerRoutes = require('./routes/customer.routes')
const taskRoutes = require('./routes/task.routes')
const meetingRoutes = require('./routes/meeting.routes')
const userRoutes = require('./routes/user.routes')

app.use('/api/auth', authRoutes)
app.use('/api/leads', leadRoutes)
app.use('/api/customers', customerRoutes)
app.use('/api/tasks', taskRoutes)
app.use('/api/meetings', meetingRoutes)
app.use('/api/users', userRoutes)

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'SmartCRM Pro API is running!' })
})

app.use(errorHandler)

// Start server
const PORT = process.env.PORT || 5000
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  startCronJobs()
})