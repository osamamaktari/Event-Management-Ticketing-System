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
    // layout: 'public' -> يعرض الصفحة كاملة الشاشة مع الهيدر المدمج بدون سايد بار
    meta: { title: 'All Events', layout: 'public' }
  },
  {
    path: '/my-tickets',
    name: 'MyTickets',
    component: MyTicketsPage,
    // 💡 تم التعديل هنا: أصبحت تفتح خارج نطاق لوحة التحكم للـ Attendee
    meta: { title: 'My Tickets', layout: 'public' }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: ProfilePage,
    // 💡 تم التعديل هنا: أصبحت تفتح خارج نطاق لوحة التحكم للـ Attendee
    meta: { title: 'Profile', layout: 'public' }
  },
  {
    path: '/auth',
    name: 'Auth',
    component: AuthPage,
    meta: { title: 'Login / Register', layout: 'public' }
  },

  // --- 🛠️ مسارات لوحة التحكم الإدارية للمنظمين (Dashboard Layout) ---
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardPage,
    // layout: 'dashboard' -> سيتعرف عليه App.vue ويقوم بإظهار السايد بار والهيدر الجانبي تلقائياً
    meta: { title: 'Dashboard', layout: 'dashboard' }
  },
  {
    path: '/event-management',
    name: 'EventManagement',
    component: EventManagementPage,
    meta: { title: 'Event Management', layout: 'dashboard' }
  },

  // إعادة توجيه أي مسار عشوائي غير معروف إلى الصفحة الرئيسية
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