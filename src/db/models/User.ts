import { Schema, model } from 'mongoose';

const UserSchema = new Schema({
    balance: { type: Number, required: true },
    heldBalance: { type: Number, required: true }
});

export const User = model('User', UserSchema);
