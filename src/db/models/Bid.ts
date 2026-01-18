import { Schema, model } from 'mongoose';

const BidSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, required: true },
    auctionId: { type: Schema.Types.ObjectId, required: true },
    amount: { type: Number, required: true },
    round: { type: Number, required: true },
    status: { type: String, enum: ['ACTIVE', 'WON', 'LOST'], required: true },
    createdAt: { type: Date, default: Date.now }
});

export const Bid = model('Bid', BidSchema);
