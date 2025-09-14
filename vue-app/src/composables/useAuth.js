// src/composables/useAuth.js
import { ref } from 'vue';
import api, { BASE_URL, setAuthToken } from '../services/api';

const user = ref(JSON.parse(localStorage.getItem('user')) || null);
const token = ref(localStorage.getItem('token') || null);
if (token.value) setAuthToken(token.value);

export function useAuth() {
  const isLogged = () => !!user.value;
  const isAdmin = () => user.value?.role === 'admin';
  const isOrganizer = () => user.value?.role === 'organizer';
  const isAttendee = () => user.value?.role === 'attendee';

  async function csrf() {
    // get sanctum cookie (credentials included)
    await fetch(`${BASE_URL}/sanctum/csrf-cookie`, { credentials: 'include' });
  }

  async function login(email, password) {
    await csrf();
    const res = await api.post('/login', { email, password });
    const u = res.data.user || res.data;
    user.value = u;
    token.value = res.data.token || null;
    if (token.value) setAuthToken(token.value);
    localStorage.setItem('user', JSON.stringify(u));
    if (token.value) localStorage.setItem('token', token.value);
    return res;
  }

  async function register(payload) {
    await csrf();
    const res = await api.post('/register', payload);
    const u = res.data.user || res.data;
    user.value = u;
    token.value = res.data.token || null;
    if (token.value) setAuthToken(token.value);
    localStorage.setItem('user', JSON.stringify(u));
    if (token.value) localStorage.setItem('token', token.value);
    return res;
  }

  async function logout() {
    try { await api.post('/logout'); } catch (e) {}
    user.value = null;
    token.value = null;
    setAuthToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }

  return { user, token, isLogged, isAdmin, isOrganizer, isAttendee, login, register, logout, csrf };
}
