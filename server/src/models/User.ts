import mongoose, { Schema, Document } from 'mongoose'

export interface IUser extends Document {
  email: string
  name: string
  passwordHash: string
  createdAt: Date
  updatedAt: Date
  lastLogin?: Date
  isActive: boolean
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    name: {
      type: String,
      required: true
    },
    passwordHash: {
      type: String,
      required: true
    },
    lastLogin: Date,
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
)

userSchema.index({ email: 1 })
userSchema.index({ createdAt: -1 })

export const User = mongoose.model<IUser>('User', userSchema)
