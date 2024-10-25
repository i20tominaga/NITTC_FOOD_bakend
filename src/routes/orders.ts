// orders.ts
import { Router } from 'express';
import { createOrder, getOrder, updateOrder, deleteOrder } from '../services/firestoreService'; // Firestoreの操作関数
import { Order } from '../types'; // Order型
import { Timestamp } from 'firebase-admin/firestore';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../config/firebaseConfig';
import { sendNotification } from '../services/notificationService';

const router = Router();

function generateUniqueOrderId(): string {
    return uuidv4();
}

// チケットナンバーを取得する関数
async function getNextTicketNumber(): Promise<number> {
    // 現在の全ての注文を取得
    const ordersSnapshot = await db.collection('Orders').get();

    // 現在使用されているチケットナンバーのセットを作成
    const usedTicketNumbers = new Set<number>();

    ordersSnapshot.forEach(doc => {
        const order = doc.data() as Order;
        usedTicketNumbers.add(Number(order.ticketNumber)); // 文字列を数値に変換
    });

    // 未使用の最も若いチケットナンバーを探す
    let nextTicketNumber = 1; // デフォルトは1
    while (usedTicketNumbers.has(nextTicketNumber)) {
        nextTicketNumber++;
    }

    return nextTicketNumber;
}

// 注文の作成
router.post('/create', async (req, res) => {
    try {
        const { userId, items, totalPrice } = req.body;

        // 必須項目のチェック
        if (!userId || !items || !totalPrice) {
            return res.status(400).json({ error: 'すべてのフィールドは必須です' });
        }

        const orderId = generateUniqueOrderId(); // 一意の注文IDを生成
        const ticketNumber = await getNextTicketNumber(); // 次のチケットナンバーを取得

        const newOrder: Order = {
            orderId,
            userId,
            ticketNumber: ticketNumber.toString(), // チケットナンバーを文字列に変換
            items,
            totalPrice,
            status: 'pending', // 初期状態を「pending」に設定
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
        };

        await createOrder(newOrder);
        res.status(201).json({ message: '注文が作成されました', orderId });
    } catch (error) {
        console.error('注文の作成エラー:', error);
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

// 注文の完了の通知
router.post('/complete/:orderId', async (req, res) => {
    try {
        const { orderId } = req.params;

        // Firestoreから注文を取得
        const orderRef = db.collection('Orders').doc(orderId);
        const orderSnapshot = await orderRef.get();

        if (!orderSnapshot.exists) {
            return res.status(404).json({ error: '注文が見つかりません' });
        }

        const order = orderSnapshot.data() as Order;

        // ユーザーのFCMトークンを取得
        const tokenSnapshot = await db.collection('UserTokens').doc(order.userId).get();
        const tokenData = tokenSnapshot.data();

        if (!tokenData || !tokenData.token) {
            return res.status(404).json({ error: 'ユーザーのトークンが見つかりません' });
        }

        const token = tokenData.token;

        // 注文のステータスを「完了」に更新
        await orderRef.update({
            status: '完了',
            updatedAt: Timestamp.now()
        });

        // 通知を送信
        await sendNotification(token, '注文が完了しました', `注文ID: ${orderId} の品が完成しました`);

        res.status(200).json({ message: '注文が完了しました', orderId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '注文の完了処理に失敗しました' });
    }
});

export default router;
