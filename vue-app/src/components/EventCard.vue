<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg dark:border dark:border-gray-700 dark:hover:border-gray-600 transition-all duration-300 overflow-hidden cursor-pointer group">
    <div class="h-48 w-full overflow-hidden">
      <img v-if="event.banner_url" :src="event.banner_url" :alt="event.title" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
      <div v-else class="w-full h-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-400 dark:text-gray-500">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
      </div>
    </div>
    <div class="p-4">
      <h3 class="text-lg font-semibold truncate text-gray-900 dark:text-white" :title="event.title">{{ event.title }}</h3>
      <p class="text-sm text-gray-600 dark:text-gray-300 mt-1 h-10 line-clamp-2">{{ event.description }}</p>
      <div class="mt-4 flex items-center justify-between text-sm">
        <div class="text-gray-700 dark:text-gray-400 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          <span>{{ dateText }}</span>
        </div>
        <div class="text-indigo-600 dark:text-indigo-400 font-bold">
          {{ startingPrice }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({ 
  event: { type: Object, required: true }
} );

// Formats the date for display
const dateText = computed(() => {
  if (!props.event?.start_date) return 'Date TBD';
  return new Date(props.event.start_date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
});

// Finds the lowest ticket price to display "Starts at..."
const startingPrice = computed(() => {
  if (!props.event.ticket_types || props.event.ticket_types.length === 0) {
    return 'Free';
  }
  const minPrice = Math.min(...props.event.ticket_types.map(t => t.price));
  return `Starts at $${minPrice}`;
});
</script>
