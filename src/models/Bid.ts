import mongoose, { Schema } from 'mongoose';

interface IBid {
    userId: string;
    auctionId: string;
    amount: number;
    round: number;
    status: 'ACTIVE' | 'WINNER';
}

const bidSchema = new Schema<IBid>({
    userId: String,
    auctionId: String,
    amount: Number,
    round: Number,
    status: { type: String, enum: ['ACTIVE', 'WINNER'] }
}, { timestamps: true });

export const Bid =
    mongoose.models.Bid ||
    mongoose.model<IBid>('Bid', bidSchema);
