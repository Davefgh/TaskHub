import { Router, Request, Response, NextFunction } from 'express'
import { User } from '../models/User.js'
import { authenticateToken } from '../middleware/auth.js'
import { AppError } from '../middleware/errorHandler.js'
import { hashPassword, verifyPassword } from '../utils/password.js'

const router = Router()

router.use(authenticateToken)

router.get('/profile', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.userId).select('-passwordHash')

    if (!user) {
      throw new AppError('User not found', 404)
    }

    res.json({
      success: true,
      data: {
        id: user._id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt
      }
    })
  } catch (error) {
    next(error)
  }
})

router.put('/profile', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email } = req.body
    const user = await User.findById(req.userId)

    if (!user) {
      throw new AppError('User not found', 404)
    }

    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email })
      if (existingUser) {
        throw new AppError('Email already in use', 400)
      }
      user.email = email
    }

    if (name) {
      user.name = name
    }

    await user.save()

    res.json({
      success: true,
      data: {
        id: user._id,
        email: user.email,
        name: user.name
      }
    })
  } catch (error) {
    next(error)
  }
})

router.put('/password', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword) {
      throw new AppError('Current password and new password are required', 400)
    }

    if (newPassword.length < 8) {
      throw new AppError('New password must be at least 8 characters', 400)
    }

    const user = await User.findById(req.userId)
    if (!user) {
      throw new AppError('User not found', 404)
    }

    const isPasswordValid = await verifyPassword(currentPassword, user.passwordHash)
    if (!isPasswordValid) {
      throw new AppError('Current password is incorrect', 401)
    }

    user.passwordHash = await hashPassword(newPassword)
    await user.save()

    res.json({
      success: true,
      message: 'Password changed successfully'
    })
  } catch (error) {
    next(error)
  }
})

export default router
