// src/services/eventsService.js
import api from './api';

// Public Events
export const getEvents = (params = {}) => api.get('/events', { params });
export const getEvent = (id) => api.get(`/events/${id}`);

// Organizer Protected Routes
export const getOrganizerEvents = () => 
  api.get('/organizer/events', { withCredentials: true });

export const createEvent = (formData) => 
  api.post('/organizer/events', formData, { withCredentials: true });

export const updateEvent = (id, formData) => 
  api.post(`/organizer/events/${id}`, formData, { withCredentials: true });

export const deleteEvent = (id) => 
  api.delete(`/organizer/events/${id}`, { withCredentials: true });

// Ticket Types
export const addTicketType = (eventId, payload) => 
  api.post(`/organizer/events/${eventId}/ticket-types`, payload, { withCredentials: true });

export const updateTicketType = (id, payload) => 
  api.put(`/organizer/ticket-types/${id}`, payload, { withCredentials: true });

export const deleteTicketType = (id) => 
  api.delete(`/organizer/ticket-types/${id}`, { withCredentials: true });
