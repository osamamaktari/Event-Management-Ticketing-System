<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
    
    <header class="h-20 bg-indigo-600 dark:bg-gray-800 text-white p-4 flex justify-between items-center shadow-md sticky top-0 z-30">
      <div class="max-w-7xl mx-auto w-full flex justify-between items-center">
        <router-link to="/" class="flex items-center gap-2 hover:opacity-90 transition-opacity">
          <TicketIcon class="w-8 h-8 text-white" />
          <h1 class="text-2xl font-bold tracking-wider">Eventify</h1>
        </router-link>

        <div class="flex items-center gap-6">
          <router-link to="/" class="text-sm font-medium hover:text-indigo-200 transition-colors">
            Explore Events
          </router-link>
          <router-link to="/profile" class="text-sm font-medium hover:text-indigo-200 transition-colors">
            My Profile
          </router-link>
          
          <button @click="$emit('toggleDarkMode')" class="p-2 rounded-full hover:bg-white/20 dark:hover:bg-gray-700 focus:outline-none transition-colors">
            <span v-if="isDark">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
            </span>
            <span v-else>
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
            </span>
          </button>
        </div>
      </div>
    </header>

    <main class="max-w-4xl mx-auto p-4 sm:p-6 md:p-8">
      <div class="mb-6 border-b dark:border-gray-800 pb-4">
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white">My Tickets</h2>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage and access your purchased event tickets.</p>
      </div>

      <div v-if="isLoading" class="text-center text-gray-500 dark:text-gray-400 py-12">
        <div class="animate-spin inline-block w-8 h-8 border-4 border-indigo-500 rounded-full border-t-transparent mb-2"></div>
        <p>Loading your tickets...</p>
      </div>

      <div v-else-if="error" class="text-center text-red-500 bg-red-100 dark:bg-red-900/20 p-4 rounded-lg">
        <p class="font-semibold">An error occurred</p>
        <p>{{ error }}</p>
      </div>

      <div v-else-if="tickets.length" class="space-y-4">
        <div v-for="ticket in tickets" :key="ticket.id" class="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all hover:shadow-md">
          
          <div class="flex-grow">
            <h3 class="font-bold text-xl text-indigo-600 dark:text-indigo-400">{{ ticket.ticket_type?.event?.title || 'Unknown Event' }}</h3>
            
            <div class="mt-2 space-y-1 text-sm text-gray-700 dark:text-gray-300">
              <p><strong>Ticket Type:</strong> {{ ticket.ticket_type?.name }}</p>
              <p><strong>Date:</strong> {{ ticket.ticket_type?.event?.start_date ? new Date(ticket.ticket_type.event.start_date).toLocaleDateString() : 'N/A' }}</p>
              <p class="flex items-center gap-1">
                <strong>Status:</strong> 
                <span :class="statusClass(ticket.status)" class="font-semibold px-2.5 py-0.5 rounded bg-gray-50 dark:bg-gray-700 text-xs shadow-sm">{{ ticket.status }}</span>
              </p>
            </div>
          </div>
          
          <div class="flex items-center gap-3 flex-shrink-0 w-full sm:w-auto justify-end border-t sm:border-none pt-3 sm:pt-0">
            <button @click="showQrCode(ticket)" class="text-sm bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 font-semibold transition-colors">
              Show QR
            </button>
            <button @click="handleDownloadPdf(ticket)" :disabled="isDownloading === ticket.id" class="text-sm bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 font-semibold transition-colors">
              {{ isDownloading === ticket.id ? 'Downloading...' : 'Download PDF' }}
            </button>
          </div>
        </div>
      </div>

      <div v-else class="text-center text-gray-500 dark:text-gray-400 border-2 border-dashed border-gray-300 dark:border-gray-700 p-12 rounded-lg max-w-md mx-auto mt-6">
        <p class="text-xl font-semibold">You have no tickets yet.</p>
        <p class="text-sm mt-1 mb-4">Go to the events page to explore and make your first purchase.</p>
        <router-link to="/" class="inline-block bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors">
          Browse Events
        </router-link>
      </div>
    </main>

    <QrCodeModal 
      v-if="isQrModalOpen"
      :isOpen="isQrModalOpen"
      :qrCodeValue="selectedTicket?.qr_code" 
      :ticketInfo="`${selectedTicket?.ticket_type?.event?.title} - ${selectedTicket?.ticket_type?.name}`"
      @close="isQrModalOpen = false"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import QrCodeModal from '../components/QrCodeModal.vue';
import { TicketIcon } from '@heroicons/vue/24/outline';
import { useAuth } from '../composables/useAuth';
import { useNotifications } from '../composables/useNotifications';
import { getUserTickets, downloadTicket } from '../services/ticketsService.js';

// استقبال البروبس والاميتس للتحكم بالـ Dark Mode من ملف App.vue الاصل
defineProps({
  isDark: {
    type: Boolean,
    required: true
  }
});
defineEmits(['toggleDarkMode']);

// --- Composables ---
const { isLogged } = useAuth();
const { showSuccess, showError } = useNotifications();

// --- Component State ---
const tickets = ref([]);
const isLoading = ref(true);
const error = ref(null);
const isDownloading = ref(null);

// --- Modal State ---
const isQrModalOpen = ref(false);
const selectedTicket = ref(null);

// --- Fetch Tickets from API ---
async function fetchTickets() {
  if (!isLogged()) {
    error.value = 'Please log in to view your tickets.';
    isLoading.value = false;
    return;
  }

  isLoading.value = true;
  error.value = null;

  try {
    const res = await getUserTickets();
    tickets.value = res.data || [];
  } catch (err) {
    console.error(err);
    error.value = err.response?.data?.message || 'Failed to load your tickets.';
  } finally {
    isLoading.value = false;
  }
}

// --- Methods ---
function showQrCode(ticket) {
  selectedTicket.value = ticket;
  isQrModalOpen.value = true;
}

// --- PDF Download Logic ---
async function handleDownloadPdf(ticket) {
  isDownloading.value = ticket.id;

  try {
    const res = await downloadTicket(ticket.id);
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${ticket.ticket_type?.event?.title || 'event'}-ticket.pdf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showSuccess('Your ticket PDF download has started.');
  } catch (err) {
    console.error(err);
    showError('Could not download the ticket. Please try again later.');
  } finally {
    isDownloading.value = null;
  }
}

// --- Helper Functions ---
function statusClass(status) {
  const styles = {
    active: 'text-green-600 dark:text-green-400',
    used: 'text-yellow-600 dark:text-yellow-500',
    cancelled: 'text-red-600 dark:text-red-500',
  };
  return styles[status] || 'text-gray-500';
}

// --- Lifecycle ---
onMounted(() => {
  fetchTickets();
});
</script>