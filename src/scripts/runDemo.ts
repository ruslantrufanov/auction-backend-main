import { Auction } from '../models/Auction';
import { Bid } from '../models/Bid';
import { User } from '../models/User';

export default async function runDemo() {
    const auctionsCount = await Auction.countDocuments();
    if (auctionsCount > 0) {
        console.log('Demo already exists');
        return;
    }

    console.log('Creating demo data...');

    const users = await User.insertMany([
        { balance: 1000, heldBalance: 0 },
        { balance: 1000, heldBalance: 0 },
        { balance: 1000, heldBalance: 0 }
    ]);

    const auction = await Auction.create({
        itemName: 'Demo Item',
        totalItems: 1,
        remainingItems: 1,
        roundIndex: 1
    });

    await Bid.insertMany(
        users.map(user => ({
            userId: user._id.toString(),
            auctionId: auction._id.toString(),
            amount: Math.floor(Math.random() * 200) + 50,
            round: auction.roundIndex, // 🔥 ВОТ ОНО
            status: 'ACTIVE'
        }))
    );

    console.log('Demo data created');
}
