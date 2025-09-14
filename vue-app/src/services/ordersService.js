// src/services/ordersService.js
import api from './api';

export const createOrder = (eventId, payload) => api.post(`/events/${eventId}/orders`, payload);
export const payOrder = (orderId, payload) => api.post(`/orders/${orderId}/pay`, payload);
export const getUserOrders = () => api.get('/user/orders');
export const getOrder = (id) => api.get(`/orders/${id}`);
