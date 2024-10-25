import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

if (!process.env.SERVICE_ACCOUNT_KEY) {
    console.error("Error: SERVICE_ACCOUNT_KEY is not defined in environment variables");
    process.exit(1);
}

// サービスアカウントキーを環境変数から読み込む
const serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT_KEY);

const app = initializeApp({
    credential: cert(serviceAccount),
    storageBucket: process.env.STORAGE_BUCKET,
});

const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
