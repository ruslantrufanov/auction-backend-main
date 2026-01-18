import mongoose from 'mongoose';
import { User } from '../db/models/User';
import { Auction } from '../db/models/Auction';
import { Bid } from '../db/models/Bid';

export async function placeBid(
    userId: string,
    auctionId: string,
    amount: number
) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const auction = await Auction.findById(auctionId).session(session);
        if (!auction || auction.status !== 'ACTIVE') {
            throw new Error('Auction not active');
        }

        const user = await User.findById(userId).session(session);
        if (!user) throw new Error('User not found');

        const existingBid = await Bid.findOne({
            userId,
            auctionId,
            round: auction.roundIndex,
            status: 'ACTIVE'
        }).session(session);

        const prevAmount = existingBid?.amount ?? 0;
        if (amount <= prevAmount) {
            throw new Error('Bid must be higher');
        }

        const delta = amount - prevAmount;
        if (user.balance < delta) {
            throw new Error('Not enough balance');
        }

        user.balance -= delta;
        user.heldBalance += delta;
        await user.save({ session });

        if (existingBid) {
            existingBid.amount = amount;
            await existingBid.save({ session });
        } else {
            await Bid.create([{
                userId,
                auctionId,
                amount,
                round: auction.roundIndex,
                status: 'ACTIVE'
            }], { session });
        }

        await session.commitTransaction();
    } catch (e) {
        await session.abortTransaction();
        throw e;
    } finally {
        session.endSession();
    }
}
