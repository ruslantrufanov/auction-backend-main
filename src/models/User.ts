import mongoose, { Schema } from 'mongoose';

export interface IUser {
    balance: number;
    heldBalance: number;
}

const userSchema = new Schema<IUser>({
    balance: { type: Number, required: true },
    heldBalance: { type: Number, required: true }
}, { timestamps: true });

export const User =
    mongoose.models.User ||
    mongoose.model<IUser>('User', userSchema);
