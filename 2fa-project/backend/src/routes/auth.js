const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const prisma = require('../prismaClient')
const sendOTP = require('../utils/sendOTP')

const router = express.Router()

// --- SIGNUP (for testing the flow end-to-end) ---
router.post('/signup', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' })

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) return res.status(400).json({ error: 'User already exists' })

  const hashed = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({ data: { email, password: hashed } })
  res.json({ id: user.id, email: user.email })
})

// --- LOGIN ---
router.post('/login', async (req, res) => {
  const { email, password } = req.body
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return res.status(401).json({ error: 'Invalid email or password' })

  const valid = await bcrypt.compare(password, user.password)
  if (!valid) return res.status(401).json({ error: 'Invalid email or password' })

  if (user.twoFactorEnabled) {
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    await prisma.user.update({
      where: { id: user.id },
      data: { otpCode: otp, otpExpiry, otpAttempts: 0 }
    })

    await sendOTP(user.phone || user.email, otp)

    const tempToken = jwt.sign(
      { id: user.id, purpose: 'OTP_VERIFICATION' },
      process.env.JWT_SECRET,
      { expiresIn: '10m' }
    )

    return res.json({ requiresOTP: true, tempToken })
  }

  const token = jwt.sign(
    { id: user.id, role: user.role, workspaceId: user.workspaceId },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  )
  res.json({ token })
})

// --- VERIFY OTP ---
router.post('/verify-otp', async (req, res) => {
  const { otp, tempToken } = req.body

  let decoded
  try {
    decoded = jwt.verify(tempToken, process.env.JWT_SECRET)
  } catch {
    return res.status(401).json({ error: 'Session expired. Please log in again.' })
  }

  if (decoded.purpose !== 'OTP_VERIFICATION') {
    return res.status(401).json({ error: 'Invalid token' })
  }

  const user = await prisma.user.findUnique({ where: { id: decoded.id } })
  if (!user) return res.status(401).json({ error: 'User not found' })

  if (user.otpAttempts >= 3) {
    return res.status(429).json({ error: 'Too many failed attempts. Please log in again.' })
  }

  if (user.otpCode !== otp || !user.otpExpiry || user.otpExpiry < new Date()) {
    await prisma.user.update({
      where: { id: user.id },
      data: { otpAttempts: user.otpAttempts + 1 }
    })
    return res.status(400).json({ error: 'Invalid or expired OTP' })
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { otpCode: null, otpExpiry: null, otpAttempts: 0 }
  })

  const fullToken = jwt.sign(
    { id: user.id, role: user.role, workspaceId: user.workspaceId },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  )

  res.json({ token: fullToken })
})

// --- RESEND OTP ---
router.post('/resend-otp', async (req, res) => {
  const { tempToken } = req.body

  let decoded
  try {
    decoded = jwt.verify(tempToken, process.env.JWT_SECRET)
  } catch {
    return res.status(401).json({ error: 'Session expired. Please log in again.' })
  }

  const user = await prisma.user.findUnique({ where: { id: decoded.id } })
  if (!user) return res.status(401).json({ error: 'User not found' })

  const otp = Math.floor(100000 + Math.random() * 900000).toString()
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000)

  await prisma.user.update({
    where: { id: user.id },
    data: { otpCode: otp, otpExpiry, otpAttempts: 0 }
  })

  await sendOTP(user.phone || user.email, otp)
  res.json({ message: 'A new code has been sent.' })
})

module.exports = router
