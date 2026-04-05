import mongoose, { Schema, Document, Types } from 'mongoose'

export interface IComment extends Document {
  taskId: Types.ObjectId
  userId: Types.ObjectId
  content: string
  createdAt: Date
  updatedAt: Date
}

const commentSchema = new Schema<IComment>(
  {
    taskId: {
      type: Schema.Types.ObjectId,
      ref: 'Task',
      required: true
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true,
      maxlength: 2000
    }
  },
  { timestamps: true }
)

commentSchema.index({ taskId: 1, createdAt: 1 })
commentSchema.index({ userId: 1 })

export const Comment = mongoose.model<IComment>('Comment', commentSchema)
