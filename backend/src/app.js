const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const connectDB = require('./configs/db.config');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieSession = require("cookie-session");

// Import routes
const indexRouter = require('./routes');
const userRouter = require('./routes/user.route');
const authRouter = require('./routes/auth.route');
const categoryRouter = require('./routes/category.route');
const productRouter = require('./routes/product.route');

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
app.use('/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/category', categoryRouter);
app.use('/api/products', productRouter);

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

module.exports = app;
