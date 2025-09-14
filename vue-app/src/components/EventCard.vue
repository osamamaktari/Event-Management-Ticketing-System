<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md dark:border dark:border-gray-700 dark:hover:border-gray-600 transition overflow-hidden">
    <div class="h-44 md:h-52 w-full">
      <img v-if="event.banner_url" :src="event.banner_url" alt="" class="w-full h-full object-cover" />
      <div v-else class="w-full h-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-400 dark:text-gray-500">
        No image
      </div>
    </div>
    <div class="p-4">
      <h3 class="text-lg font-semibold truncate text-gray-900 dark:text-white">{{ event.title }}</h3>
      <p class="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">{{ event.description }}</p>
      <div class="mt-3 flex items-center justify-between">
        <div class="text-sm text-gray-700 dark:text-gray-400">{{ dateText }}</div>
        <button @click="$emit('view', event)" class="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-md text-sm">View</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
const props = defineProps({ event: Object });
const dateText = computed(() => {
  if (!props.event?.start_date) return 'Date TBD';
  const d = new Date(props.event.start_date);
  return d.toLocaleString();
});
</script>
