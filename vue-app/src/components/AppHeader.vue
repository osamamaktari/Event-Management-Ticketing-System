<!-- 

<template>
  <header class="bg-indigo-600 text-white p-4 flex justify-between items-center">
    <button class="md:hidden" @click="$emit('toggleSidebar')">☰</button>
    <h1 class="text-lg font-bold">{{ title }}</h1>
  </header>
</template>

<script setup>
defineProps({
  title: { type: String, default: 'Event Management' }
});
</script> -->

<template>
 
  
  <header class="h-20 bg-gray-600 dark:bg-gray-800 text-white p-4 flex justify-between items-center shadow-md">
   
    <div class="flex items-center gap-4">
      <button class="md:hidden text-white" @click="$emit('toggleSidebar')">
  
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 12h16"></path></svg>
      </button>
        <TicketIcon class="w-8 h-8" />
        <h1 class="text-2xl font-bold">Eventify</h1>
    </div>


    <button @click="$emit('toggleDarkMode' )" class="p-2 rounded-full hover:bg-white/20 dark:hover:bg-gray-700 focus:outline-none transition-colors">
      <span v-if="isDark">
  
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
      </span>
      <span v-else>
     
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
      </span>
    </button>

  </header>
</template>

<script setup>
import { 
 
  TicketIcon, 

} from '@heroicons/vue/24/outline';

defineProps({
  title: { 
    type: String, 
    default: 'Event Management' 
  },
  isDark: {
    type: Boolean,
    required: true
  }
} );


defineEmits(['toggleSidebar', 'toggleDarkMode']);
</script>

