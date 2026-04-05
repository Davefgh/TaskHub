import { Task } from '../models/Task.js'
import { AppError } from '../middleware/errorHandler.js'
import { Types } from 'mongoose'

export interface TaskFilters {
  status?: string[]
  priority?: string[]
  assigneeId?: string
  projectId?: string
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  page?: number
  limit?: number
}

export class TaskService {
  async createTask(userId: string, taskData: any) {
    const task = new Task({
      ...taskData,
      createdBy: userId,
      assigneeId: taskData.assigneeId || userId
    })
    await task.save()
    return task.populate(['assigneeId', 'createdBy'])
  }

  async getTasksByUser(userId: string, filters: TaskFilters) {
    const query: any = {
      $or: [
        { createdBy: userId },
        { assigneeId: userId }
      ]
    }

    if (filters.status && filters.status.length > 0) {
      query.status = { $in: filters.status }
    }

    if (filters.priority && filters.priority.length > 0) {
      query.priority = { $in: filters.priority }
    }

    if (filters.assigneeId) {
      query.assigneeId = filters.assigneeId
    }

    if (filters.projectId) {
      query.projectId = filters.projectId
    }

    if (filters.search) {
      query.$text = { $search: filters.search }
    }

    let queryBuilder = Task.find(query)

    if (filters.sortBy) {
      const sortOrder = filters.sortOrder === 'desc' ? -1 : 1
      queryBuilder = queryBuilder.sort({ [filters.sortBy]: sortOrder })
    } else {
      queryBuilder = queryBuilder.sort({ dueDate: 1 })
    }

    const page = filters.page || 1
    const limit = filters.limit || 20
    const skip = (page - 1) * limit

    const total = await Task.countDocuments(query)
    const tasks = await queryBuilder.skip(skip).limit(limit).populate(['assigneeId', 'createdBy'])

    return {
      tasks,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    }
  }

  async getTaskById(taskId: string) {
    const task = await Task.findById(taskId).populate(['assigneeId', 'createdBy', 'comments'])
    if (!task) {
      throw new AppError('Task not found', 404)
    }
    return task
  }

  async updateTask(taskId: string, userId: string, updates: any) {
    const task = await Task.findById(taskId)
    if (!task) {
      throw new AppError('Task not found', 404)
    }

    if (task.createdBy.toString() !== userId && task.assigneeId?.toString() !== userId) {
      throw new AppError('Unauthorized', 403)
    }

    Object.assign(task, updates)
    await task.save()
    return task.populate(['assigneeId', 'createdBy'])
  }

  async deleteTask(taskId: string, userId: string) {
    const task = await Task.findById(taskId)
    if (!task) {
      throw new AppError('Task not found', 404)
    }

    if (task.createdBy.toString() !== userId) {
      throw new AppError('Unauthorized', 403)
    }

    await Task.deleteOne({ _id: taskId })
  }
}

export const taskService = new TaskService()
