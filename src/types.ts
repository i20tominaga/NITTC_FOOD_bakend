import { Timestamp } from 'firebase-admin/firestore';

// Usersコレクションのインターフェース
export interface User {
    userId: string;        // ユーザーの一意なID（UID）
    email: string;         // ユーザーのメールアドレス
    name: string;          // ユーザーの名前
    role: 'user' | 'admin'; // ユーザーの役割（例: "user", "admin"）
    createdAt: Timestamp; // アカウント作成日時
    updatedAt: Timestamp; // 最終更新日時
}

// Inventoryコレクションのインターフェース
export interface InventoryItem {
    itemId: string;        // 商品の一意なID
    itemName: string;      // 商品名（例: "うどん"）
    quantity: number;      // 現在の在庫数
    unitPrice: number;     // 単価
    updatedAt: Timestamp; // 最終更新日時
}

// Ordersコレクションのインターフェース
export interface Order {
    orderId: string;       // 注文の一意なID
    userId: string;        // 注文を行ったユーザーID
    ticketNumber: string;   // 整理券番号
    items: {
        itemId: string;      // 注文した商品のID
        itemName: string;    // 商品名
        quantity: number;    // 注文した数量
        unitPrice: number;   // 単価
    }[];
    totalPrice: number;    // 合計金額
    status: 'pending' | 'completed'; // 注文の状態（例: "pending", "completed"）
    createdAt: Timestamp; // 注文作成日時
    updatedAt: Timestamp; // 最終更新日時
}

// Notificationコレクションのインターフェース
export interface Notification {
    notificationId: string; // 通知の一意なID
    userId: string;         // 通知の受信者のユーザーID
    message: string;        // 通知メッセージの内容
    sentAt: Timestamp;     // 送信日時
    read: boolean;          // 通知が既読かどうか
}
