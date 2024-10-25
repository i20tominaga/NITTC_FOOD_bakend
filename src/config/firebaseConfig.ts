import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

// サービスアカウントキーを環境変数から取得
const serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT_KEY as string);

// Firebase の初期化
const app = initializeApp({
    credential: cert(serviceAccount),
    storageBucket: process.env.STORAGE_BUCKET, // 環境変数からストレージバケットを指定
});

const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
