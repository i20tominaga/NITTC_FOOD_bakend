// src/app.ts
import express from 'express';
import bodyParser from 'body-parser';
import authRoutes from './routes/auth';
import ticketRoutes from './routes/tickets';

const app = express();
app.use(bodyParser.json());

// 各ルートを登録
app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);

export default app;
