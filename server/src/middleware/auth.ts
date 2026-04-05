import { Request, Response, NextFunction } from 'express'
import { verifyToken } from '../utils/jwt.js'
import { AppError } from './errorHandler.js'

declare global {
  namespace Express {
    interface Request {
      userId?: string
    }
  }
}

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1]

  if (!token) {
    throw new AppError('Unauthorized', 401)
  }

  const decoded = verifyToken(token)
  if (!decoded) {
    throw new AppError('Invalid or expired token', 401)
  }

  req.userId = decoded.userId
  next()
}
