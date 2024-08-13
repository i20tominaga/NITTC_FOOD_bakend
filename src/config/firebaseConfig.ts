import { initializeApp, applicationDefault, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import * as path from 'path';
import * as fs from 'fs';

// サービスアカウントキーのパス
const serviceAccountPath = path.resolve(__dirname, '../../serviceAccountKey.json');

// サービスアカウントキーの読み込み
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

// Firebase の初期化
const app = initializeApp({
    credential: cert(serviceAccount),
    storageBucket: 'udon-9d359.appspot.com' // ストレージバケットを指定
});

const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
