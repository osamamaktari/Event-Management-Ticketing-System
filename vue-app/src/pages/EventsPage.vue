<template>
  <div class="p-4 sm:p-6 md:p-8">
    <h2 class="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Our Events</h2>

    <!-- Loading State -->
    <div v-if="isLoading" class="text-center text-gray-500 dark:text-gray-400">
      <p>Loading events...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center text-red-500 bg-red-100 dark:bg-red-900/20 p-4 rounded-lg">
      <p class="font-semibold">An error occurred</p>
      <p>{{ error }}</p>
    </div>

    <!-- Events Grid -->
    <div v-else-if="filteredEvents.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <EventCard 
  v-for="event in filteredEvents" 
  :key="event.id" 
  :event="event" 
  @click="openModal(event)" 
/>

    </div>
    
    <!-- No Events Found -->
    <div v-else class="text-center text-gray-500 dark:text-gray-400 border-2 border-dashed dark:border-gray-700 p-12 rounded-lg">
      <p class="text-xl font-semibold">No events found.</p>
      <p>Please check back later.</p>
    </div>

    <!-- Event Details Modal -->
    <EventModal 
      v-if="isModalOpen"
      :isOpen="isModalOpen" 
      :event="selectedEvent" 
      @close="closeModal" 
      @create-order="prepareCreateOrder"
    />

    <!-- Confirmation Modal -->
    <ConfirmationModal
      :isOpen="isConfirmModalOpen"
      :type="confirmModalType"
      :title="confirmModalTitle"
      :message="confirmModalMessage"
      :confirmText="confirmModalActionText"
      :showCancel="confirmModalShowCancel"
      @confirm="executeOrder"
      @cancel="cancelOrder"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import EventCard from '../components/EventCard.vue';
import EventModal from '../components/EventModal.vue';
import ConfirmationModal from '@/components/ConfirmationModal.vue';
import { getEvents } from '../services/eventsService';
import { createOrder } from '../services/ordersService';
import { useAuth } from '../composables/useAuth';
import { useNotifications } from '../composables/useNotifications';

// --- Composables ---
const { isLogged } = useAuth();
const { showSuccess, showError } = useNotifications();

// --- Component State ---
const events = ref([]);             
const searchQuery = ref('');        
const isLoading = ref(true);
const error = ref(null);
const selectedEvent = ref(null);
const isModalOpen = ref(false);

// --- Confirmation Modal State ---
const isConfirmModalOpen = ref(false);
const confirmModalType = ref('confirm');
const confirmModalTitle = ref('');
const confirmModalMessage = ref('');
const confirmModalActionText = ref('Confirm');
const confirmModalShowCancel = ref(true);
const pendingOrderPayload = ref(null);


// async function fetchEvents() {
//   isLoading.value = true;
//   error.value = null;
//   try {
//     const res = await getEvents();
//     events.value = res.data.data;
//   } catch (err) {
//     error.value = 'Failed to load events. Please try again later.';
//     console.error(err);
//   } finally {
//     isLoading.value = false;
//   }
// }

async function fetchEvents() {
  isLoading.value = true;
  error.value = null;
  try {
    const res = await getEvents();
    //  keep only approved events
    events.value = res.data.data.filter(ev => ev.status === 'approved');
  } catch (err) {
    error.value = 'Failed to load events. Please try again later.';
    console.error(err);
  } finally {
    isLoading.value = false;
  }
}


const props = defineProps({
  searchQuery: { type: String, default: '' }  
});


const filteredEvents = computed(() => {
  if (!props.searchQuery) return events.value;
  return events.value.filter(ev =>
    ev.title.toLowerCase().includes(props.searchQuery.toLowerCase())
  );
});




function handleSearch(query) {
  searchQuery.value = query;
}


// --- Modal Handling ---
function openModal(event) {
  selectedEvent.value = event;
  isModalOpen.value = true;
}

function closeModal() {
  isModalOpen.value = false;
}

// --- Prepare Order ---
function prepareCreateOrder(orderPayload) {
  if (!isLogged()) {
    showError('Please log in to purchase tickets.');
    return;
  }
  pendingOrderPayload.value = orderPayload;
  const totalItems = orderPayload.items.reduce((sum, item) => sum + item.quantity, 0);
  const plural = totalItems > 1 ? 's' : '';

  confirmModalType.value = 'confirm';
  confirmModalTitle.value = 'Confirm Your Purchase';
  confirmModalMessage.value = `You are about to purchase ${totalItems} ticket${plural} for "${selectedEvent.value.title}". Do you want to proceed?`;
  confirmModalActionText.value = 'Yes, Buy Now';
  confirmModalShowCancel.value = true;
  isConfirmModalOpen.value = true;

  closeModal();
}

// --- Execute Order ---
async function executeOrder() {
  isConfirmModalOpen.value = false;
  if (!pendingOrderPayload.value) return;

  try {
    await createOrder(selectedEvent.value.id, pendingOrderPayload.value);
    showSuccess('Purchase successful! Your tickets are now confirmed.');
  } catch (err) {
    showError(err.response?.data?.message || 'Failed to create order.');
  } finally {
    pendingOrderPayload.value = null;
  }
}

// --- Cancel Order ---
function cancelOrder() {
  isConfirmModalOpen.value = false;
  pendingOrderPayload.value = null;
}

// --- Lifecycle ---
onMounted(() => {
  fetchEvents();
});
</script>
