// src/app.ts
import express from 'express';
import bodyParser from 'body-parser';
import authRoutes from './routes/auth';
import ticketRoutes from './routes/tickets';
import inventoryRoutes from './routes/inventory';
import orderRoutes from './routes/orders';
import cors from 'cors';

const app = express();
app.use(bodyParser.json());
app.use(cors());

// 各ルートを登録
app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/orders', orderRoutes);

export default app;
