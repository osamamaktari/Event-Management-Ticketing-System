<!-- src/components/EventCard.vue -->
<template>
  <div class="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden">
    <div class="h-44 md:h-52 w-full">
      <img v-if="event.banner_url" :src="event.banner_url" alt="" class="w-full h-full object-cover" />
      <div v-else class="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
        No image
      </div>
    </div>
    <div class="p-4">
      <h3 class="text-lg font-semibold truncate">{{ event.title }}</h3>
      <p class="text-sm text-gray-600 mt-1 line-clamp-2">{{ event.description }}</p>
      <div class="mt-3 flex items-center justify-between">
        <div class="text-sm text-gray-700">{{ dateText }}</div>
        <button @click="$emit('view', event)" class="px-3 py-1 bg-indigo-600 text-white rounded-md text-sm">View</button>
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
