import { Router } from 'express';
import { createOrder, getOrder, updateOrder, deleteOrder } from '../services/firestoreService'; // Firestoreの操作関数
import { Order } from '../types'; // Order型
import { Timestamp } from 'firebase-admin/firestore';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../config/firebaseConfig';

const router = Router();

function generateUniqueOrderId(): string {
    return uuidv4();
}

// 注文の作成
router.post('/create', async (req, res) => {
    try {
        const { userId, ticketId, items, totalPrice, status } = req.body;

        const orderId = generateUniqueOrderId(); // 一意の注文IDを生成

        const newOrder: Order = {
            orderId,
            userId,
            ticketId,
            items,
            totalPrice,
            status,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
        };

        await createOrder(newOrder);
        res.status(201).json({ message: '注文が作成されました', orderId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '注文の作成に失敗しました' });
    }
});

// ユーザーの注文履歴を取得
router.get('/getHistory/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const ordersSnapshot = await db.collection('Orders').where('userId', '==', userId).get();
        if (!ordersSnapshot.empty) {
            const orders = ordersSnapshot.docs.map(doc => doc.data() as Order);
            res.status(200).json(orders);
        } else {
            res.status(404).json({ error: '注文が見つかりません' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '注文履歴の取得に失敗しました' });
    }
});

// 全ての注文を取得
router.get('/getAll', async (req, res) => {
    try {
        const ordersSnapshot = await db.collection('Orders').get();
        if (!ordersSnapshot.empty) {
            const orders = ordersSnapshot.docs.map(doc => doc.data() as Order);
            res.status(200).json(orders);
        } else {
            res.status(404).json({ error: '注文が見つかりません' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '注文の取得に失敗しました' });
    }
});

export default router;
