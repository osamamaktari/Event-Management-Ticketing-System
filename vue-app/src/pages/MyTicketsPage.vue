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
      <!-- We are integrating the logic from TicketDownload.vue directly here -->
      <div v-for="ticket in tickets" :key="ticket.id" class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        
        <!-- Ticket Information -->
        <div class="flex-grow">
          <!-- Accessing nested data as per the requirements -->
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

    <!-- QR Code Modal (reusing the component) -->
    <QrCodeModal 
      v-if="isQrModalOpen"
      :isOpen="isQrModalOpen"
      :qrCodeValue="selectedTicket.qr_code"
      :ticketInfo="`${selectedTicket.ticket_type.event.title} - ${selectedTicket.ticket_type.name}`"
      @close="isQrModalOpen = false"
    />

     <ConfirmationModal
      :isOpen="isConfirmModalOpen"
      :type="confirmModalType"
      :title="confirmModalTitle"
      :message="confirmModalMessage"
      confirmText="Close"
      :showCancel="false" 
      @confirm="isConfirmModalOpen = false"
      @cancel="isConfirmModalOpen = false"
    />

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
// We don't need TicketDownload.vue anymore
// import TicketDownload from '../components/TicketDownload.vue'; 
import QrCodeModal from '../components/QrCodeModal.vue';
import ConfirmationModal from '../components/ConfirmationModal.vue';
const isConfirmModalOpen = ref(false);
const confirmModalType = ref('error');
const confirmModalTitle = ref('');
const confirmModalMessage = ref('');
// --- Mock Data for Frontend Development ---
// This data structure matches the API requirements
const mockTickets = [
  { 
    id: 1, 
    qr_code: 'MOCK_QR_CODE_12345', 
    status: 'active',
    ticket_type: {
      name: 'VIP',
      event: {
        title: 'Epic Music Concert',
        start_date: '2025-10-01T19:00:00',
      }
    }
  },
  { 
    id: 2, 
    qr_code: 'MOCK_QR_CODE_67890', 
    status: 'used',
    ticket_type: {
      name: 'All-Access Pass',
      event: {
        title: 'Future of Tech Conference',
        start_date: '2025-11-05T09:00:00',
      }
    }
  },
];

// --- Component State ---
const tickets = ref([]);
const isLoading = ref(true);
const error = ref(null);
const isDownloading = ref(null); // Use ticket ID to track which one is downloading

// --- Modal State ---
const isQrModalOpen = ref(false);
const selectedTicket = ref(null);

// --- Data Fetching ---
onMounted(async () => {
  // To work with the backend, replace the mock function with the real API call.
  await fetchMockData();
  // await fetchApiData(); // UNCOMMENT THIS LINE TO USE THE REAL API
});

// --- MOCK FUNCTION (for frontend only) ---
async function fetchMockData() {
  isLoading.value = true;
  error.value = null;
  await new Promise(resolve => setTimeout(resolve, 1000));
  tickets.value = mockTickets;
  isLoading.value = false;
}

/*
// --- REAL API FUNCTION (use when backend is ready) ---
import { getUserTickets, downloadTicket } from '../services/ticketsService';

async function fetchApiData() {
  isLoading.value = true;
  error.value = null;
  try {
    const response = await getUserTickets();
    tickets.value = response.data;
  } catch (err) {
    error.value = 'Failed to load your tickets.';
    console.error(err);
  } finally {
    isLoading.value = false;
  }
}
*/

// --- Methods ---
function showQrCode(ticket) {
  selectedTicket.value = ticket;
  isQrModalOpen.value = true;
}

// --- PDF Download Logic ---
function handleDownloadPdf(ticket) {
  isDownloading.value = ticket.id;
    // ---   (Frontend Only) ---
  console.log(`Simulating PDF download for ticket: "${ticket.ticket_type.event.title}".`);
  
  //failed senario
  setTimeout(() => {
    showErrorModal('Download Failed', 'Could not connect to the server to download the ticket. Please try again later.');
    isDownloading.value = null;
  }, 2000);

  /* success
  setTimeout(() => {
    console.log('Download successful simulation.');
    isDownloading.value = null;
  }, 2000);
  */

  /*
  // --- REAL PDF DOWNLOAD LOGIC (use when backend is ready) ---
  try {
    const response = await downloadTicket(ticket.id);
    // ... a lot of code to create and click a link ...
  } catch (err) {
    console.error(err);
    // alert()
    showErrorModal('Download Failed', err.response?.data?.message || 'An unknown error occurred.');
  } finally {
    isDownloading.value = null;
  }
  */
}
function showErrorModal(title, message) {
  confirmModalType.value = 'error';
  confirmModalTitle.value = title;
  confirmModalMessage.value = message;
  isConfirmModalOpen.value = true;
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
</script>
