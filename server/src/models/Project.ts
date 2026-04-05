import mongoose, { Schema, Document, Types } from 'mongoose'

export interface IProject extends Document {
  name: string
  description?: string
  ownerId: Types.ObjectId
  members: Types.ObjectId[]
  createdAt: Date
  updatedAt: Date
}

const projectSchema = new Schema<IProject>(
  {
    name: {
      type: String,
      required: true,
      maxlength: 255
    },
    description: {
      type: String,
      maxlength: 5000
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    ]
  },
  { timestamps: true }
)

projectSchema.index({ ownerId: 1 })
projectSchema.index({ createdAt: -1 })

export const Project = mongoose.model<IProject>('Project', projectSchema)
