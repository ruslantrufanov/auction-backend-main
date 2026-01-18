import { Router } from 'express';
import { User } from '../models/User';

const router = Router();

router.post('/', async (req, res) => {
    try {
        let { balance } = req.body;

        // Принудительно конвертируем в число
        balance = Number(balance);
        if (isNaN(balance) || balance < 0) balance = 1000; // защита

        const user = await User.create({ balance, heldBalance: 0 });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
});

router.get('/', async (_req, res) => {
    const users = await User.find();
    res.json(users);
});

export default router;
