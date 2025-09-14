<template>
  <div>
    <h2 class="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Manage Your Events</h2>
    <div v-for="event in events" :key="event.id" class="border border-gray-200 dark:border-gray-700 p-4 rounded-lg shadow bg-white dark:bg-gray-800 mb-3">
      <h3 class="font-bold text-gray-900 dark:text-white">{{ event.title }}</h3>
      <button class="mt-2 px-4 py-2 bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white rounded">Edit Event</button>
      <button class="mt-2 px-4 py-2 bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white rounded ml-2">Delete Event</button>
      <button class="mt-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded ml-2">Manage Tickets</button>
      <TicketsTable :event="event" class="mt-4" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import TicketsTable from '../components/TicketsTable.vue';

const events = ref([
  { id: 1, title: 'Music Concert', attendees: [] },
  { id: 2, title: 'Tech Conference', attendees: [] },
]);
</script>
