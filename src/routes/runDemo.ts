import { Router } from 'express';
import { Auction } from '../models/Auction';
import { Bid } from '../models/Bid';
import { User } from '../models/User';

const router = Router();

router.post('/', async (_req, res) => {
    try {
        // очистка
        await Auction.deleteMany({});
        await Bid.deleteMany({});
        await User.deleteMany({});

        // пользователи
        const users = await User.insertMany([
            { balance: 1000, heldBalance: 0 },
            { balance: 1000, heldBalance: 0 },
            { balance: 1000, heldBalance: 0 }
        ]);

        // аукцион
        const auction = await Auction.create({
            itemName: 'Demo item',
            totalItems: 1,
            remainingItems: 1,
            roundIndex: 1
        });

        // ставки
        const bids = await Bid.insertMany(
            users.map((u, i) => ({
                userId: u._id.toString(),
                auctionId: auction._id.toString(),
                amount: 100 + i * 50,
                round: 1,
                status: 'ACTIVE'
            }))
        );

        res.json({
            message: 'Demo data created',
            auction,
            users,
            bids
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'runDemo failed' });
    }
});

export default router;
