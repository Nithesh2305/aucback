require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');

// 1. IMPORT ROUTES
const userAuthRoutes = require('./routes/userAuthRoutes');
const auctionRoutes = require('./routes/auctionRoutes');

const app = express();

// Middleware
app.use(express.json());

// Database
connectDB();

// 2. USE ROUTES
app.use('/api/user/auth', userAuthRoutes);
app.use('/api/auctions', auctionRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
