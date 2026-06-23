const bcrypt = require('bcryptjs')
const prisma = require('../config/db')
const { generateAccessToken, generateRefreshToken } = require('../utils/generateToken')
const jwt = require('jsonwebtoken')

const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body
    const exists = await prisma.user.findUnique({ where: { email } })
    if (exists) return res.status(400).json({ message: 'Email already exists' })

    const hashed = await bcrypt.hash(password, 12)
    const user = await prisma.user.create({
      data: { name, email, password: hashed, role }
    })

    res.status(201).json({ message: 'User created', user: { id: user.id, name: user.name, role: user.role } })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return res.status(400).json({ message: 'Invalid credentials' })

    const match = await bcrypt.compare(password, user.password)
    if (!match) return res.status(400).json({ message: 'Invalid credentials' })

    const accessToken = generateAccessToken(user)
    const refreshToken = generateRefreshToken(user)

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

    res.json({
      accessToken,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
}

const refresh = async (req, res) => {
  try {
    const token = req.cookies.refreshToken
    if (!token) return res.status(401).json({ message: 'No refresh token' })

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET)
    const user = await prisma.user.findUnique({ where: { id: decoded.id } })
    const accessToken = generateAccessToken(user)

    res.json({ accessToken })
  } catch {
    res.status(401).json({ message: 'Invalid refresh token' })
  }
}

const logout = (req, res) => {
  res.clearCookie('refreshToken')
  res.json({ message: 'Logged out' })
}

module.exports = { register, login, refresh, logout }