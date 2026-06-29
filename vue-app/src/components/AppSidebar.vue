<template>
  <aside class="fixed md:static inset-y-0 left-0 bg-white dark:bg-gray-800 w-64 shadow-lg z-40 p-4 flex flex-col
                 transform transition-transform duration-300 md:translate-x-0"
         :class="show ? 'translate-x-0' : '-translate-x-full'">
    
    <div class="flex items-center justify-center h-16 border-b border-gray-200 dark:border-gray-700">
      <router-link to="/" class="flex items-center gap-3 text-indigo-600 dark:text-indigo-400">
        <TicketIcon class="w-8 h-8" />
        <h1 class="text-2xl font-bold">Eventify</h1>
      </router-link>
    </div>

    <nav class="flex flex-col gap-2 mt-6 text-gray-600 dark:text-gray-300">
      <router-link v-for="link in navLinks" :key="link.to" :to="link.to" 
                   class="flex items-center gap-4 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors" 
                   @click="$emit('close')">
        <component :is="link.icon" class="w-6 h-6" />
        <span class="font-medium">{{ link.text }}</span>
      </router-link>
    </nav>

    <div v-if="isLogged()" class="border-t border-gray-200 dark:border-gray-700 mt-4 pt-4">
      <button @click="handleLogout" 
              class="w-full flex items-center gap-4 px-3 py-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors font-medium">
        <ArrowLeftOnRectangleIcon class="w-6 h-6" />
        <span>Logout</span>
      </button>
    </div>

  </aside>
</template>

<script setup>
import { useRouter } from 'vue-router'; // استيراد موجه المسارات للتحويل بعد الـ logout
import { useAuth } from '../composables/useAuth'; 
import { 
  CalendarDaysIcon, 
  TicketIcon, 
  Cog8ToothIcon, 
  ChartPieIcon, 
  UserCircleIcon, 
  LockClosedIcon,
  UsersIcon,
  ArrowLeftOnRectangleIcon // 🌟 أيقونة تسجيل الخروج من Heroicons
} from '@heroicons/vue/24/outline';

defineProps({ show: Boolean });
const emit = defineEmits(['close']);

const router = useRouter();
const { isLogged, logout } = useAuth(); // 🌟 استخراج دالة الـ logout والتحقق من الدخول

const navLinks = [
  { to: '/', text: 'Events', icon: CalendarDaysIcon },
  { to: '/attendees', text: 'Attendees', icon: UsersIcon },
  { to: '/event-management', text: 'Manage Events', icon: Cog8ToothIcon },
  { to: '/dashboard', text: 'Dashboard', icon: ChartPieIcon },
  { to: '/profile', text: 'Profile', icon: UserCircleIcon },
  { to: '/auth', text: 'Login/Register', icon: LockClosedIcon }
];


function handleLogout() {
  emit('close'); 
  if (typeof logout === 'function') {
    logout(); 
  }
  router.push({ name: 'Auth' }); 
}
</script>