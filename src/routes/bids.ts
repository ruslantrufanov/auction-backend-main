import { Router } from 'express';
import { Bid } from '../models/Bid';

const router = Router();

router.post('/', async (req, res) => {
    try {
        const { userId, auctionId, amount, round } = req.body;

        const bid = await Bid.create({
            userId,
            auctionId,
            amount,
            round,
            status: 'ACTIVE'
        });

        res.json(bid);
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
});

router.get('/', async (_req, res) => {
    const bids = await Bid.find();
    res.json(bids);
});

export default router;
