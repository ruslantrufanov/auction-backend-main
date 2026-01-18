import { Schema, model } from 'mongoose';

const AuctionSchema = new Schema({
    totalItems: { type: Number, required: true },
    remainingItems: { type: Number, required: true },
    roundIndex: { type: Number, required: true },
    roundEndsAt: { type: Date, required: true },
    status: { type: String, enum: ['ACTIVE', 'FINISHED'], required: true }
});

export const Auction = model('Auction', AuctionSchema);
