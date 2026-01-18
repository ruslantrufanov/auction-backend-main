import { Router } from 'express';
import { Auction } from '../db/models/Auction';
import { placeBid } from '../modules/bidding.service';

export const auctionRoutes = Router();

auctionRoutes.post('/auctions', async (_req, res) => {
    const auction = await Auction.create({
        totalItems: 10,
        remainingItems: 10,
        roundIndex: 1,
        roundEndsAt: new Date(Date.now() + 60000),
        status: 'ACTIVE'
    });
    res.json(auction);
});

auctionRoutes.post('/bids', async (req, res) => {
    const { userId, auctionId, amount } = req.body;
    await placeBid(userId, auctionId, amount);
    res.sendStatus(200);
});
