import { Router, Request, Response, NextFunction } from 'express'
import { taskService } from '../services/TaskService.js'
import { authenticateToken } from '../middleware/auth.js'
import { AppError } from '../middleware/errorHandler.js'

const router = Router()

router.use(authenticateToken)

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filters = {
      status: req.query.status ? (req.query.status as string).split(',') : undefined,
      priority: req.query.priority ? (req.query.priority as string).split(',') : undefined,
      assigneeId: req.query.assigneeId as string,
      projectId: req.query.projectId as string,
      search: req.query.search as string,
      sortBy: req.query.sortBy as string,
      sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'asc',
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 20
    }

    const result = await taskService.getTasksByUser(req.userId!, filters)

    res.json({
      success: true,
      data: result.tasks,
      pagination: result.pagination
    })
  } catch (error) {
    next(error)
  }
})

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, description, priority, status, projectId, assigneeId, dueDate } = req.body

    if (!title) {
      throw new AppError('Title is required', 400)
    }

    const task = await taskService.createTask(req.userId!, {
      title,
      description,
      priority: priority || 'Medium',
      status: status || 'To Do',
      projectId,
      assigneeId,
      dueDate
    })

    res.status(201).json({
      success: true,
      data: task
    })
  } catch (error) {
    next(error)
  }
})

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const task = await taskService.getTaskById(req.params.id)

    res.json({
      success: true,
      data: task
    })
  } catch (error) {
    next(error)
  }
})

router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const task = await taskService.updateTask(req.params.id, req.userId!, req.body)

    res.json({
      success: true,
      data: task
    })
  } catch (error) {
    next(error)
  }
})

router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await taskService.deleteTask(req.params.id, req.userId!)

    res.json({
      success: true,
      message: 'Task deleted successfully'
    })
  } catch (error) {
    next(error)
  }
})

export default router
