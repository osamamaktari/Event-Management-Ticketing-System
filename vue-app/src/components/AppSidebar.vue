<template>
  <aside class="fixed md:static inset-y-0 left-0 bg-white dark:bg-gray-800 w-64 shadow-lg z-0 p-4 flex flex-col
                 transform transition-transform duration-300 md:translate-x-0"
         :class="show ? 'translate-x-0' : '-translate-x-full'">
    
       <div class="flex items-center justify-center h-16 border-b border-gray-200 dark:border-gray-700">
      <router-link to="/" class="flex items-center gap-3 text-indigo-600 dark:text-indigo-400">
        <TicketIcon class="w-8 h-8" />
        <h1 class="text-2xl font-bold">Eventify</h1>
      </router-link>
    </div>

    <nav class="flex flex-col gap-4 mt-6 text-gray-600 dark:text-gray-300">
      <router-link v-for="link in navLinks" :key="link.to" :to="link.to" 
                   class="flex items-center gap-4 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors" 
                   @click="$emit('close')">
        <component :is="link.icon" class="w-6 h-6" />
        <span class="font-medium">{{ link.text }}</span>
      </router-link>
    </nav>

  </aside>
</template>

<script setup>
import { 
  CalendarDaysIcon, 
  TicketIcon, 
  Cog8ToothIcon, 
  ChartPieIcon, 
  UserCircleIcon, 
  LockClosedIcon 
} from '@heroicons/vue/24/outline';

defineProps({ show: Boolean });
defineEmits(['close']);

const navLinks = [
  { to: '/', text: 'Events', icon: CalendarDaysIcon },
  { to: '/my-tickets', text: 'My Tickets', icon: TicketIcon },
  { to: '/event-management', text: 'Manage Events', icon: Cog8ToothIcon },
  { to: '/dashboard', text: 'Dashboard', icon: ChartPieIcon },
  { to: '/profile', text: 'Profile', icon: UserCircleIcon },
  { to: '/auth', text: 'Login/Register', icon: LockClosedIcon }
];
</script>
