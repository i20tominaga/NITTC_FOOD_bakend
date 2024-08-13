// src/routes/auth.ts
import { Router } from 'express';
import { auth } from '../config/firebaseConfig';

const router = Router();

// ユーザー登録
router.post('/register', async (req, res) => {
    const { email, password } = req.body;

    try {
        const userRecord = await auth.createUser({ email, password });
        res.status(201).json({ uid: userRecord.uid });
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        } else {
            res.status(400).json({ error: 'An unknown error occurred' });
        }
    }
});

// ユーザーログイン
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const idToken = req.headers.authorization?.split('Bearer ')[1];

        if (!idToken) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const decodedToken = await auth.verifyIdToken(idToken);
        res.status(200).json({ message: 'Login successful', user: decodedToken });
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        } else {
            res.status(400).json({ error: 'An unknown error occurred' });
        }
    }
});

// ユーザーログアウト
router.post('/logout', (req, res) => {
    res.status(200).json({ message: 'Logout endpoint. Use Firebase client SDK for logout.' });
});

export default router;
