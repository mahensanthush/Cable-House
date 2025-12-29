const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();


app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB Connected!');
        console.log('Active Database:', mongoose.connection.name); 
    })
    .catch(err => console.log('DB Connection Error:', err));

app.use('/api/cables', require('./routes/cableRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));   
app.use('/api/orders', require('./routes/orderRoutes')); 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));