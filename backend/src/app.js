const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const authRoutes = require('./routes/auth.routes');
const foodRoutes = require('./routes/food.routes');
const foodPartnerRoutes = require('./routes/foodPartner.routes');
const orderRoutes = require('./routes/order.routes');
const { notFound, errorHandler } = require('./middlewares/error.middleware');

const app = express();

const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
    .split(',')
    .map((o) => o.trim().replace(/\/$/, ''));
const isProd = process.env.NODE_ENV === 'production';

app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin(origin, callback) {
            // non-browser clients (curl, server-to-server) send no origin
            if (!origin) return callback(null, true);
            // in dev, accept any localhost port so Vite can pick 5173/5174/etc.
            if (!isProd && /^http:\/\/localhost:\d+$/.test(origin)) {
                return callback(null, true);
            }
            if (allowedOrigins.includes(origin)) return callback(null, true);
            return callback(new Error('Not allowed by CORS'));
        },
        credentials: true,
    })
);

if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('dev'));
}

// health check
app.get('/', (req, res) => {
    res.json({ status: 'ok', service: 'reelo-api' });
});

app.use('/api/auth', authRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/food-partner', foodPartnerRoutes);
app.use('/api/orders', orderRoutes);

// 404 + central error handler (must be last)
app.use(notFound);
app.use(errorHandler);

module.exports = app;
