import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import connectDB from './configs/db.config.js';
import bodyParser from 'body-parser';
import cors from 'cors';
import cookieSession from 'cookie-session';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Import routes
import indexRouter from './routes/index.js';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import categoryRouter from './routes/category.route.js';
import productRouter from './routes/product.route.js';
import orderRouter from './routes/order.route.js';

// Khởi tạo app
const app = express();

// Kết nối database
connectDB();

// Cấu hình CORS
const corsOptions = {
    origin: process.env.ALLOWED_ORIGINS || "*",
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};
app.use(cors(corsOptions));

// Middleware
app.use(logger('dev'));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static(path.join(__dirname, 'public')));

// Cấu hình session
app.use(
    cookieSession({
        name: "fastfood-session",
        keys: [process.env.COOKIE_SECRET],
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000 // 24 giờ
    })
);

// Routes
app.use('/', indexRouter);
app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/category', categoryRouter);
app.use('/api/products', productRouter);
app.use('/api/orders', orderRouter);
// Error handling
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        error: {
            message: err.message || 'Có lỗi xảy ra!',
            status: err.status || 500
        }
    });
});

export default app;