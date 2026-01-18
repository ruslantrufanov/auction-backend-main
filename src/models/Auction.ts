import mongoose, { Schema } from 'mongoose';

export interface IAuction {
    itemName: string;
    totalItems: number;
    remainingItems: number;
    roundIndex: number;
}

const auctionSchema = new Schema<IAuction>({
    itemName: { type: String, required: true },
    totalItems: { type: Number, required: true },
    remainingItems: { type: Number, required: true },
    roundIndex: { type: Number, default: 1 }
}, { timestamps: true });

export const Auction =
    mongoose.models.Auction ||
    mongoose.model<IAuction>('Auction', auctionSchema);
