import { Router, Request, Response, NextFunction } from 'express'
import { authService } from '../services/AuthService.js'
import { AppError } from '../middleware/errorHandler.js'

const router = Router()

router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, name } = req.body

    if (!email || !password || !name) {
      throw new AppError('Missing required fields', 400)
    }

    const user = await authService.register(email, password, name)

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      }
    })
  } catch (error) {
    next(error)
  }
})

router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      throw new AppError('Missing required fields', 400)
    }

    const { user, token } = await authService.login(email, password)

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000
    })

    res.json({
      success: true,
      message: 'Login successful',
      user,
      token
    })
  } catch (error) {
    next(error)
  }
})

router.post('/logout', (req: Request, res: Response) => {
  res.clearCookie('token')
  res.json({
    success: true,
    message: 'Logout successful'
  })
})

export default router
