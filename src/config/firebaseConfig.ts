import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

// 環境変数からサービスアカウントキーを取得
const serviceAccountKey = process.env.SERVICE_ACCOUNT_KEY;

if (!serviceAccountKey) {
    console.error("Error: SERVICE_ACCOUNT_KEY is not defined in environment variables");
    process.exit(1); // エラーメッセージを表示してアプリを終了
}

let serviceAccount;
try {
    serviceAccount = JSON.parse(serviceAccountKey);
} catch (error) {
    console.error("Failed to parse SERVICE_ACCOUNT_KEY:", error);
    process.exit(1);
}

const app = initializeApp({
    credential: cert(serviceAccount),
    storageBucket: process.env.STORAGE_BUCKET,
});

const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
