// src/routes/tickets.ts
import { Router } from 'express';
import { db } from '../config/firebaseConfig';

const router = Router();

// 整理券予約
router.post('/reserve', async (req, res) => {
    try {
        const { userId, dateTime } = req.body;
        if (!userId || !dateTime) {
            return res.status(400).json({ error: 'ユーザIDと日時は必須です' });
        }

        const ticketId = `${userId}-${new Date().toISOString()}`;
        const ticketRef = db.collection('Tickets').doc(ticketId);

        await ticketRef.set({ userId, dateTime, ticketId });

        return res.status(201).json({ ticketId, message: '整理券が予約されました' });
    } catch (error) {
        console.error('整理券予約エラー:', error);
        return res.status(500).json({ error: '整理券の予約に失敗しました' });
    }
});

// ユーザーが予約した整理券の情報を取得するエンドポイント
router.get('/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const ticketsRef = db.collection('Tickets');
        const snapshot = await ticketsRef.where('userId', '==', userId).get();

        if (snapshot.empty) {
            return res.status(404).json({ message: 'No tickets found for this user' });
        }

        const tickets = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.status(200).json(tickets);
    } catch (error) {
        console.error('Error fetching tickets:', error);
        res.status(500).json({ error: 'Failed to fetch tickets' });
    }
});

// 整理券のキャンセル
router.delete('/cancel/:ticketId', async (req, res) => {
    const { ticketId } = req.params;

    try {
        const ticketRef = db.collection('Tickets').doc(ticketId);
        const doc = await ticketRef.get();

        if (!doc.exists) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        await ticketRef.delete();
        res.status(200).json({ message: 'Ticket reservation canceled successfully' });
    } catch (error) {
        console.error('Error canceling ticket:', error);
        res.status(500).json({ error: 'Failed to cancel ticket' });
    }
});

export default router;
