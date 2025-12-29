import React, { useState, useEffect } from 'react';
import axios from 'axios';

const OrderList = () => {
  const [orders, setOrders] = useState([]);

  // 1. useEffect stops the infinite loop
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // 2. The URL matches your server.js /api/orders path
        const res = await axios.get('https://cable-house-backend.onrender.com/api/orders');
        setOrders(res.data);
      } catch (err) {
        console.error("Order Fetch Failed:", err);
      }
    };
    fetchOrders();
  }, []); // 3. The empty [] ensures this runs only once

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold">Current Orders</h2>
      {orders.map(order => (
        <div key={order._id} className="border p-2 my-2">
          {order.cableName} - <span className="text-blue-500">{order.status}</span>
        </div>
      ))}
    </div>
  );
};
