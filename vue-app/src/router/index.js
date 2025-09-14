// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';

// Pages
import AuthPage from '../pages/AuthPage.vue';
import EventsPage from '../pages/EventsPage.vue';
import DashboardPage from '../pages/DashboardPage.vue';
import EventManagementPage from '../pages/EventManagementPage.vue';
import MyTicketsPage from '../pages/MyTicketsPage.vue';
import ProfilePage from '../pages/ProfilePage.vue';

const routes = [
  {
    path: '/',
    name: 'Events',
    component: EventsPage,
    meta: { title: 'All Events' }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardPage,
    meta: { title: 'Dashboard' }
  },
  {
    path: '/event-management',
    name: 'EventManagement',
    component: EventManagementPage,
    meta: { title: 'Event Management' }
  },
  {
    path: '/my-tickets',
    name: 'MyTickets',
    component: MyTicketsPage,
    meta: { title: 'My Tickets' }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: ProfilePage,
    meta: { title: 'Profile' }
  },
  {
    path: '/auth',
    name: 'Auth',
    component: AuthPage,
    meta: { title: 'Login / Register' }
  },
  // Redirect unknown routes to Events page
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
