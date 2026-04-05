import mongoose, { Schema, Document, Types } from 'mongoose'

export interface ITask extends Document {
  title: string
  description?: string
  status: 'To Do' | 'In Progress' | 'Done' | 'Blocked'
  priority: 'Low' | 'Medium' | 'High' | 'Critical'
  projectId?: Types.ObjectId
  assigneeId?: Types.ObjectId
  createdBy: Types.ObjectId
  dueDate?: Date
  createdAt: Date
  updatedAt: Date
  comments: Types.ObjectId[]
}

const taskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: true,
      maxlength: 255
    },
    description: {
      type: String,
      maxlength: 5000
    },
    status: {
      type: String,
      enum: ['To Do', 'In Progress', 'Done', 'Blocked'],
      default: 'To Do'
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium'
    },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: 'Project'
    },
    assigneeId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    dueDate: Date,
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Comment'
      }
    ]
  },
  { timestamps: true }
)

taskSchema.index({ projectId: 1 })
taskSchema.index({ assigneeId: 1 })
taskSchema.index({ status: 1 })
taskSchema.index({ priority: 1 })
taskSchema.index({ dueDate: 1 })
taskSchema.index({ createdAt: -1 })
taskSchema.index({ title: 'text', description: 'text' })

export const Task = mongoose.model<ITask>('Task', taskSchema)
