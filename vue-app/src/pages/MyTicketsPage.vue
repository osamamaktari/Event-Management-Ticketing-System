<template>
  <div class="p-4 sm:p-6 md:p-8">
    <h2 class="text-3xl font-bold mb-6 text-gray-900 dark:text-white">My Tickets</h2>

    <!-- Loading State -->
    <div v-if="isLoading" class="text-center text-gray-500 dark:text-gray-400">
      <p>Loading your tickets...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center text-red-500 bg-red-100 dark:bg-red-900/20 p-4 rounded-lg">
      <p class="font-semibold">An error occurred</p>
      <p>{{ error }}</p>
    </div>

    <!-- Tickets List -->
    <div v-else-if="tickets.length" class="space-y-4">
      <div v-for="ticket in tickets" :key="ticket.id" class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        
        <!-- Ticket Information -->
        <div class="flex-grow">
          <h3 class="font-bold text-lg text-indigo-600 dark:text-indigo-400">{{ ticket.ticket_type.event.title }}</h3>
          <p class="text-gray-800 dark:text-gray-200 mt-1">
            <strong>Ticket:</strong> {{ ticket.ticket_type.name }}
          </p>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            <strong>Date:</strong> {{ new Date(ticket.ticket_type.event.start_date).toLocaleDateString() }}
          </p>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            <strong>Status:</strong> 
            <span :class="statusClass(ticket.status)" class="font-semibold">{{ ticket.status }}</span>
          </p>
        </div>
        
        <!-- Action Buttons -->
        <div class="flex items-center gap-3 flex-shrink-0">
          <button @click="showQrCode(ticket)" class="text-sm bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 font-semibold">
            Show QR
          </button>
          <button @click="handleDownloadPdf(ticket)" :disabled="isDownloading === ticket.id" class="text-sm bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-400 font-semibold">
            {{ isDownloading === ticket.id ? 'Downloading...' : 'Download PDF' }}
          </button>
        </div>
      </div>
    </div>

    <!-- No Tickets Found -->
    <div v-else class="text-center text-gray-500 dark:text-gray-400 border-2 border-dashed dark:border-gray-700 p-12 rounded-lg">
      <p class="text-xl font-semibold">You have no tickets yet.</p>
      <p>Go to the events page to make a purchase.</p>
    </div>

    <!-- QR Code Modal -->
    <QrCodeModal 
      v-if="isQrModalOpen"
      :isOpen="isQrModalOpen"
      :qrCodeValue="selectedTicket.qr_code" 
      :ticketInfo="`${selectedTicket.ticket_type.event.title} - ${selectedTicket.ticket_type.name}`"
      @close="isQrModalOpen = false"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import QrCodeModal from '../components/QrCodeModal.vue';
import { useAuth } from '../composables/useAuth';
import { useNotifications } from '../composables/useNotifications';
import { getUserTickets, downloadTicket } from '../services/ticketsService.js';

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
    link.setAttribute('download', `${ticket.ticket_type.event.title}-ticket.pdf`);
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
