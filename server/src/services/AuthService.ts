import { User } from '../models/User.js'
import { hashPassword, verifyPassword } from '../utils/password.js'
import { generateToken } from '../utils/jwt.js'
import { AppError } from '../middleware/errorHandler.js'

export class AuthService {
  async register(email: string, password: string, name: string) {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      throw new AppError('Invalid email format', 400)
    }

    // Validate password strength
    if (password.length < 8) {
      throw new AppError('Password must be at least 8 characters', 400)
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      throw new AppError('Email already registered', 400)
    }

    // Hash password
    const passwordHash = await hashPassword(password)

    // Create user
    const user = new User({
      email,
      name,
      passwordHash
    })

    await user.save()
    return user
  }

  async login(email: string, password: string) {
    // Find user
    const user = await User.findOne({ email })
    if (!user) {
      throw new AppError('Invalid credentials', 401)
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.passwordHash)
    if (!isPasswordValid) {
      throw new AppError('Invalid credentials', 401)
    }

    // Generate token
    const token = generateToken(user._id.toString())

    // Update last login
    user.lastLogin = new Date()
    await user.save()

    return {
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      },
      token
    }
  }
}

export const authService = new AuthService()
