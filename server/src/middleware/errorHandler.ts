import { Request, Response, NextFunction } from 'express'

export class AppError extends Error {
  constructor(public message: string, public status: number) {
    super(message)
  }
}

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(err)

  if (err instanceof AppError) {
    return res.status(err.status).json({
      success: false,
      message: err.message
    })
  }

  res.status(500).json({
    success: false,
    message: 'Internal server error'
  })
}
