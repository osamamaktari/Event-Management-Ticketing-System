// src/services/ticketsService.js
import api from './api';

export const getUserTickets = () => api.get('/user/tickets');
export const getTicket = (id) => api.get(`/tickets/${id}`);
export const downloadTicket = (ticketId) => api.get(`/tickets/${ticketId}/download`, { responseType: 'blob' });
