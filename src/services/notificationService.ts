// src/services/notificationService.ts
import admin from 'firebase-admin';

/**
 * FCMを使用して通知を送信する関数
 * @param token ユーザーのFCMトークン
 * @param title 通知のタイトル
 * @param body 通知の本文
 */
export async function sendNotification(token: string, title: string, body: string) {
    const message = {
        notification: {
            title,
            body
        },
        token
    };

    try {
        const response = await admin.messaging().send(message);
        console.log('Successfully sent message:', response);
    } catch (error) {
        console.error('Error sending message:', error);
    }
}
