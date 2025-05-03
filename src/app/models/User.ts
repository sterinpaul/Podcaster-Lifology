import mongoose, { Schema, Document, Model } from 'mongoose';

interface IUser extends Document {
  userId: string;
  selectedPodcasts: string[];
}

const userSchema: Schema<IUser> = new Schema(
  {
    userId: { type: String, unique: true, required: true },
    selectedPodcasts: { type: [String], default: [] },
  },
  { timestamps: true }
);

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;
