const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const authRoutes = require('./routes/auth.routes');
const foodRoutes = require('./routes/food.routes');
const { notFound, errorHandler } = require('./middlewares/error.middleware');

const app = express();

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: CLIENT_URL,
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

// 404 + central error handler (must be last)
app.use(notFound);
app.use(errorHandler);

module.exports = app;
