const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Optimized MongoDB Connection
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        console.log(`📂 Active Database: ${conn.connection.name}`);
    } catch (err) {
        console.error(`❌ DB Connection Error: ${err.message}`);
        process.exit(1); // Stop the server if DB fails
    }
};
connectDB();

// Routes
app.use('/api/cables', require('./routes/cableRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));   
app.use('/api/orders', require('./routes/orderRoutes')); 

// Health Check (Good for hosted platforms like Render/Railway)
app.get('/health', (req, res) => res.send('Server is healthy!'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));
