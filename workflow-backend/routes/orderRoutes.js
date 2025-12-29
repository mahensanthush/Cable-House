const express = require('express');
const router = express.Router();
const Order = require('../models/Order');


router.get('/', async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


router.patch('/:id', async (req, res) => {
    try {
        const { status } = req.body;
        const update = { status };
        if (status === 'In Progress') update.startTime = Date.now();
        if (status === 'Finished') update.endTime = Date.now();
        
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id, update, { new: true });
        res.json(updatedOrder);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


router.post('/', async (req, res) => {
    const order = new Order(req.body);
    try {
        const savedOrder = await order.save();
        res.status(201).json(savedOrder);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


router.delete('/:id', async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id);
        res.json({ message: "Order deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


module.exports = router;