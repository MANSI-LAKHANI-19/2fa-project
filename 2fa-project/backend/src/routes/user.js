const express = require('express')
const prisma = require('../prismaClient')
const authMiddleware = require('../middleware/auth')

const router = express.Router()

// Get current user profile
router.get('/profile', authMiddleware, async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user.id } })
  if (!user) return res.status(404).json({ error: 'User not found' })
  const { password, otpCode, ...safeUser } = user
  res.json(safeUser)
})

// Update profile - used to toggle 2FA and set phone number
router.patch('/profile', authMiddleware, async (req, res) => {
  const { twoFactorEnabled, phone } = req.body

  const data = {}
  if (typeof twoFactorEnabled === 'boolean') data.twoFactorEnabled = twoFactorEnabled
  if (typeof phone === 'string') data.phone = phone

  const updated = await prisma.user.update({
    where: { id: req.user.id },
    data
  })

  const { password, otpCode, ...safeUser } = updated
  res.json(safeUser)
})

module.exports = router
