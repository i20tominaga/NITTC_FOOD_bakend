import express from 'express';

const PORT = 3000;  // 環境変数の代わりに直接設定
const DB_CONNECTION_STRING = "mongodb://localhost:27017/your-db-name";  // データベース接続文字列も同様に設定

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
