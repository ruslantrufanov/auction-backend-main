import { Router } from 'express';
import { Auction } from '../models/Auction';

const router = Router();

router.post('/', async (req, res) => {
    try {
        const { itemName, totalItems } = req.body;

        const auction = await Auction.create({
            itemName,
            totalItems,
            remainingItems: totalItems,
            roundIndex: 1
        });

        res.json(auction);
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
});

router.get('/', async (_req, res) => {
    const auctions = await Auction.find();
    res.json(auctions);
});

export default router;
