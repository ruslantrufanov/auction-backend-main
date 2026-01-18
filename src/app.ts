import express from 'express';
import dotenv from 'dotenv';
import { connectMongo } from './db/mongo';
import { auctionRoutes } from './api/auctions.routes';

dotenv.config();

export async function startServer() {
    await connectMongo();

    const app = express();
    app.use(express.json());

    app.use('/api', auctionRoutes);

    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`Server started on ${port}`);
    });
}
