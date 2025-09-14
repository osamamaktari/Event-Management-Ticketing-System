<template>
  <aside class="fixed md:static inset-y-0 left-0 bg-white dark:bg-gray-800 w-64 shadow-lg z-50 p-4 flex flex-col
                 transform transition-transform duration-300 md:translate-x-0"
         :class="show ? 'translate-x-0' : '-translate-x-full'">
    <div class="border-b border-gray-200 dark:border-gray-700 pb-3 font-bold text-indigo-600 dark:text-indigo-400 text-lg">Menu</div>
    <nav class="flex flex-col gap-3 mt-4 text-gray-700 dark:text-gray-300">
      <router-link to="/" class="hover:text-indigo-600 dark:hover:text-indigo-400" @click="$emit('close')">Events</router-link>
      <router-link to="/my-tickets" class="hover:text-indigo-600 dark:hover:text-indigo-400" @click="$emit('close')">My Tickets</router-link>
      <router-link to="/event-management" class="hover:text-indigo-600 dark:hover:text-indigo-400" @click="$emit('close')">Manage Events</router-link>
      <router-link to="/dashboard" class="hover:text-indigo-600 dark:hover:text-indigo-400" @click="$emit('close')">Dashboard</router-link>
      <router-link to="/profile" class="hover:text-indigo-600 dark:hover:text-indigo-400" @click="$emit('close')">Profile</router-link>
      <router-link to="/auth" class="hover:text-indigo-600 dark:hover:text-indigo-400" @click="$emit('close')">Login/Register</router-link>
    </nav>
  </aside>
</template>

<script setup>
defineProps({ show: Boolean });
defineEmits(['close']);
</script>
