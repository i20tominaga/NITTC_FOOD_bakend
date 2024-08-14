import { Router } from "express";
import { createInventoryItem, getInventoryItem, updateInventoryItem, deleteInventoryItem } from "../services/firestoreService";
import { InventoryItem } from "../types";

const router = Router();

// 在庫状況の取得
router.get('/getStatus/:itemId', async (req, res) => {
    try {
        const itemId = req.params.itemId; // パスパラメータからitemIdを取得
        const inventoryItem = await getInventoryItem(itemId);
        if (inventoryItem) {
            res.status(200).json(inventoryItem);
        } else {
            res.status(404).json({ error: '在庫が見つかりません' });
        }
    } catch (error) {
        res.status(500).json({ error: '在庫情報の取得に失敗しました' });
    }
});

// 在庫の作成
router.post('/create', async (req, res) => {
    try {
        const item: InventoryItem = req.body;
        await createInventoryItem(item);
        res.status(201).json({ message: '在庫を作成しました' });
    } catch (error) {
        res.status(500).json({ error: '在庫の作成に失敗しました' });
    }
});

// 在庫の更新
router.post('/update', async (req, res) => {
    const { itemId, newQuantity, user } = req.body;

    // 管理者チェック（ここで認証ミドルウェアを使用するのが一般的です）
    if (!user || !user.isAdmin) {
        return res.status(403).json({ error: '管理者権限が必要です' });
    }

    try {
        const item = await getInventoryItem(itemId);
        if (!item) {
            return res.status(404).json({ error: '在庫が見つかりません' });
        }
        item.quantity = newQuantity;
        await updateInventoryItem(item);
        res.status(200).json({ message: '在庫を更新しました' });
    } catch (error) {
        res.status(500).json({ error: '在庫の更新に失敗しました' });
    }
});

// 在庫の削除
router.delete('/delete', async (req, res) => {
    const { itemId, user } = req.body;

    // 管理者チェック（ここで認証ミドルウェアを使用するのが一般的です）
    if (!user || !user.isAdmin) {
        return res.status(403).json({ error: '管理者権限が必要です' });
    }

    try {
        await deleteInventoryItem(itemId);
        res.status(200).json({ message: '在庫を削除しました' });
    } catch (error) {
        res.status(500).json({ error: '在庫の削除に失敗しました' });
    }
});

export default router;
