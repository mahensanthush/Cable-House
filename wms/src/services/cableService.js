import axios from 'axios';

const API_URL = 'https://cable-house-backend.onrender.com/api';


const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  
  return token ? { headers: { 'x-auth-token': token } } : {};
};

const notify = () => {
  window.dispatchEvent(new Event('storage-update'));
  window.dispatchEvent(new Event('storage'));
  const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
  audio.volume = 0.5;
  audio.play().catch(() => {});
};

// --- CABLE BLUEPRINTS ---

export const getCables = async () => {
  try {
    const response = await axios.get(`${API_URL}/cables`);
    return response.data;
  } catch (error) {
    console.error("Error fetching cables:", error);
    return [];
  }
};

export const saveCable = async (cableData) => {
  try {
    
    const response = await axios.post(`${API_URL}/cables`, cableData, getAuthHeader());
    notify();
    return { success: true, data: response.data };
  } catch (error) {
    
    console.error("Error saving cable:", error.response?.data?.message || error.message);
    return { success: false };
  }
};

// --- WORKER ORDERS ---

export const getWorkerOrders = async () => {
  try {
    const response = await axios.get(`${API_URL}/orders`);
    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
};

export const placeOrder = async (cableTemplate) => {
  try {
    const orderData = {
      ...cableTemplate,
      status: 'Pending',
      startTime: null,
      endTime: null
    };
    
    const response = await axios.post(`${API_URL}/orders`, orderData, getAuthHeader());
    notify();
    return { success: true };
  } catch (error) {
    console.error("Error placing order:", error);
    return { success: false };
  }
};

export const updateOrderStatus = async (orderId, newStatus) => {
  try {
    
    await axios.patch(`${API_URL}/orders/${orderId}`, { status: newStatus }, getAuthHeader());
    notify();
    return { success: true };
  } catch (error) {
    console.error("Error updating status:", error);
    return { success: false };
  }
};

export const deleteOrder = async (orderId) => {
  try {
    
    await axios.delete(`${API_URL}/orders/${orderId}`, getAuthHeader());
    notify();
    return { success: true };
  } catch (error) {
    console.error("Error deleting order:", error);
    return { success: false };
  }
};

export const deleteCable = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/cables/${id}`, getAuthHeader());
    
    window.dispatchEvent(new Event('storage-update')); 
    return { success: true };
  } catch (error) {
    console.error("Error deleting blueprint:", error.response?.data?.message || error.message);
    return { success: false };
  }
};
