import { Auction } from '../db/models/Auction';
import { Bid } from '../db/models/Bid';
import { User } from '../db/models/User';

export async function finalizeRound(auctionId: string, winnersCount: number) {
    const auction = await Auction.findById(auctionId);
    if (!auction || auction.status !== 'ACTIVE') return;

    const bids = await Bid.find({
        auctionId,
        round: auction.roundIndex,
        status: 'ACTIVE'
    }).sort({ amount: -1, createdAt: 1 });

    const winners = bids.slice(0, winnersCount);
    const losers = bids.slice(winnersCount);

    for (const bid of winners) {
        bid.status = 'WON';
        await bid.save();
    }

    for (const bid of losers) {
        const user = await User.findById(bid.userId);
        if (!user) continue;

        user.balance += bid.amount;
        user.heldBalance -= bid.amount;

        bid.status = 'LOST';
        await Promise.all([user.save(), bid.save()]);
    }

    auction.remainingItems -= winners.length;
    auction.roundIndex += 1;

    if (auction.remainingItems <= 0) {
        auction.status = 'FINISHED';
    }

    await auction.save();
}
