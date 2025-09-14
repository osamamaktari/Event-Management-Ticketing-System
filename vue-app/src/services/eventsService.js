// src/services/eventsService.js
import api from './api';

export const getEvents = (params = {}) => api.get('/events', { params });
export const getEvent = (id) => api.get(`/events/${id}`);
export const getOrganizerEvents = () => api.get('/organizer/events');
export const createEvent = (formData) => api.post('/organizer/events', formData);
export const updateEvent = (id, formData) => api.post(`/organizer/events/${id}`, formData, { headers: { 'X-HTTP-Method-Override': 'PUT' }});
export const deleteEvent = (id) => api.delete(`/organizer/events/${id}`);
export const addTicketType = (eventId, payload) => api.post(`/organizer/events/${eventId}/ticket-types`, payload);
export const updateTicketType = (id, payload) => api.put(`/organizer/ticket-types/${id}`, payload);
export const deleteTicketType = (id) => api.delete(`/organizer/ticket-types/${id}`);
