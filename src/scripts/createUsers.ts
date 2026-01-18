import dotenv from 'dotenv';
dotenv.config();

import { connectMongo } from '../db/mongo';
import { User } from '../db/models/User';

async function main() {
    await connectMongo();

    const users = [
        { balance: 1000, heldBalance: 0 },
        { balance: 1000, heldBalance: 0 }
    ];

    for (const u of users) {
        const user = await User.create(u);
        console.log(`Created user: ${user._id}`);
    }

    process.exit(0);
}

main().catch(console.error);
