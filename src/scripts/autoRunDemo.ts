import { Auction } from '../models/Auction';
import { User } from '../models/User';
import { Bid } from '../models/Bid';

export default async function autoRunDemo() {
    // ❗ не создаём повторно
    const existing = await Auction.countDocuments();
    if (existing > 0) {
        console.log('Demo already exists — skip');
        return;
    }

    console.log('Creating demo auction & bids...');

    // --- Auction ---
    const auction = await Auction.create({
        itemName: 'Demo Auction Item',
        totalItems: 1,
        remainingItems: 1,
        roundIndex: 1
    });

    // --- Users ---
    const users = await User.insertMany([
        { balance: 1000, heldBalance: 0 },
        { balance: 1000, heldBalance: 0 },
        { balance: 1000, heldBalance: 0 }
    ]);

    // --- Random bids ---
    await Bid.insertMany(
        users.map(user => ({
            userId: user._id.toString(),
            auctionId: auction._id.toString(),
            amount: Math.floor(Math.random() * 500) + 100,
            round: auction.roundIndex,
            status: 'ACTIVE'
        }))
    );

    console.log('Demo data successfully created');
}
