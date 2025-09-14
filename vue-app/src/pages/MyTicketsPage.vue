<template>
  <div>
    <h2 class="text-2xl font-bold mb-4 text-gray-900 dark:text-white">My Tickets</h2>
    <div v-for="ticket in tickets" :key="ticket.id" class="border border-gray-200 dark:border-gray-700 p-4 rounded-lg shadow bg-white dark:bg-gray-800 mb-3">
      <h3 class="font-bold text-gray-900 dark:text-white">{{ ticket.eventTitle }}</h3>
      <p class="text-gray-700 dark:text-gray-300">Ticket Type: {{ ticket.type }}</p>
      <p class="text-gray-700 dark:text-gray-300">Status: {{ ticket.status }}</p>
      <TicketDownload :ticket="ticket" class="mt-2" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import TicketDownload from '../components/TicketDownload.vue';

const tickets = ref([
  { id: 1, eventTitle: 'Music Concert', type: 'VIP', status: 'Active', qr_code:'QR123', pdf_url:'#' },
  { id: 2, eventTitle: 'Tech Conference', type: 'Standard', status: 'Active', qr_code:'QR456', pdf_url:'#' },
]);
</script>
