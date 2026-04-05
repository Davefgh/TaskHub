import mongoose, { Schema, Document, Types } from 'mongoose'

export interface ISession extends Document {
  userId: Types.ObjectId
  token: string
  expiresAt: Date
  createdAt: Date
  isValid: boolean
}

const sessionSchema = new Schema<ISession>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    token: {
      type: String,
      required: true,
      unique: true
    },
    expiresAt: {
      type: Date,
      required: true
    },
    isValid: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
)

sessionSchema.index({ userId: 1 })
sessionSchema.index({ token: 1 }, { unique: true })
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

export const Session = mongoose.model<ISession>('Session', sessionSchema)
