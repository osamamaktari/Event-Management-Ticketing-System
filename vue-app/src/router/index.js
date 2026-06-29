import { createRouter, createWebHistory } from 'vue-router';
import { useAuth } from '../composables/useAuth'; // استيراد الـ Composable الخاص بك

// Pages
import AuthPage from '../pages/AuthPage.vue';
import EventsPage from '../pages/EventsPage.vue';
import DashboardPage from '../pages/DashboardPage.vue';
import EventManagementPage from '../pages/EventManagementPage.vue';
import MyTicketsPage from '../pages/MyTicketsPage.vue';
import ProfilePage from '../pages/ProfilePage.vue';
import AttendeesPage from '../pages/AttendeesPage.vue';

const routes = [
  {
    path: '/',
    name: 'Events',
    component: EventsPage,
    meta: { title: 'All Events', layout: 'public' }
  },
  {
    path: '/my-tickets',
    name: 'MyTickets',
    component: MyTicketsPage,
    meta: { title: 'My Tickets', layout: 'public', requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: ProfilePage,
    meta: { title: 'Profile', layout: 'public', requiresAuth: true }
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
    meta: {
      title: 'Dashboard',
      layout: 'dashboard',
      requiresAuth: true,
      requiresOrganizer: true // حماية خاصة بالمنظمين والإدمن فقط
    }
  },
  {
    path: '/event-management',
    name: 'EventManagement',
    component: EventManagementPage,
    meta: {
      title: 'Event Management',
      layout: 'dashboard',
      requiresAuth: true,
      requiresOrganizer: true // حماية خاصة بالمنظمين والإدمن فقط
    }
  },
  {
    path: '/attendees',
    name: 'Attendees',
    component: AttendeesPage,
    meta: {
      title: 'Attendees',
      layout: 'dashboard',    // لكي تفتح داخل لوحة التحكم مع السايدبار
      requiresAuth: true,     // تمنع الزوار غير المسجلين
      requiresOrganizer: true // تمنع الـ attendee العادي من الدخول هنا
    }
  },

  // إعادة توجيه أي مسار عشوائي غير معروف إلى الصفحة الرئيسية
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  },

];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// 🔒 جدار الحماية (Navigation Guard) باستخدام الـ useAuth الخاص بك
router.beforeEach((to, from, next) => {
  const { isLogged, isOrganizer, isAdmin } = useAuth();

  // 1. تحديث عنوان الصفحة تلقائياً
  document.title = to.meta.title ? `${to.meta.title} | EventApp` : 'EventApp';

  // 2. التحقق إذا كانت الصفحة تتطلب تسجيل دخول والمستخدم غير مسجل
  if (to.meta.requiresAuth && !isLogged()) {
    return next({ name: 'Auth' });
  }

  // 3. منع الـ attendee من الدخول للـ dashboard والسماح فقط للـ organizer أو الـ admin
  if (to.meta.requiresOrganizer && !isOrganizer() && !isAdmin()) {
    return next({ name: 'Events' }); // تحويله فوراً للصفحة الرئيسية
  }

  // 4. إذا تجاوز كل الفحوصات يمر بشكل طبيعي
  next();
});

export default router;