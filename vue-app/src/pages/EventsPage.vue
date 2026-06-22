<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
    
    <header class="h-20 bg-indigo-600 dark:bg-gray-800 text-white p-4 flex justify-between items-center shadow-md sticky top-0 z-30">
      <div class="max-w-7xl mx-auto w-full flex justify-between items-center">
        
        <router-link to="/" class="flex items-center gap-2 hover:opacity-90 transition-opacity">
          <TicketIcon class="w-8 h-8 text-white" />
          <h1 class="text-2xl font-bold tracking-wider">Eventify</h1>
        </router-link>

        <div class="flex items-center gap-4 sm:gap-6">
          
          <template v-if="isLogged()">
            <router-link to="/my-tickets" class="text-sm font-medium hover:text-indigo-200 transition-colors">
              My Tickets
            </router-link>
            <router-link to="/profile" class="text-sm font-medium hover:text-indigo-200 transition-colors">
              My Profile
            </router-link>
          </template>

          <template v-else>
            <router-link to="/auth" class="text-sm font-medium bg-white text-indigo-600 dark:bg-gray-700 dark:text-white px-4 py-1.5 rounded-lg hover:bg-opacity-90 transition-all shadow-sm">
              Login
            </router-link>
          </template>

          <span class="h-5 w-[1px] bg-white/30 hidden sm:block"></span>

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

    <main class="max-w-7xl mx-auto p-4 sm:p-6 md:p-8">
      
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b dark:border-gray-800 pb-6">
        <div>
          <h2 class="text-3xl font-extrabold text-gray-900 dark:text-white">Explore Events</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Book tickets for your favorite events instantly.</p>
        </div>
        
        <div class="relative w-full md:w-80">
          <span class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </span>
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Search events by title..." 
            class="pl-10 pr-4 py-2.5 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
          />
        </div>
      </div>

      <div v-if="isLoading" class="text-center text-gray-500 dark:text-gray-400 py-20">
        <div class="animate-spin inline-block w-8 h-8 border-4 border-indigo-500 rounded-full border-t-transparent mb-2"></div>
        <p class="font-medium">Loading events...</p>
      </div>

      <div v-else-if="error" class="text-center text-red-500 bg-red-100 dark:bg-red-900/20 p-4 rounded-lg max-w-xl mx-auto">
        <p class="font-semibold">An error occurred</p>
        <p>{{ error }}</p>
      </div>

      <div v-else-if="filteredEvents.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <EventCard 
          v-for="event in filteredEvents" 
          :key="event.id" 
          :event="event" 
          @click="openModal(event)" 
        />
      </div>
      
      <div v-else class="text-center text-gray-500 dark:text-gray-400 border-2 border-dashed border-gray-300 dark:border-gray-700 p-12 rounded-lg max-w-md mx-auto mt-10">
        <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        <p class="text-xl font-semibold">No approved events found.</p>
        <p class="text-sm mt-1">Try changing your search key or check again later.</p>
      </div>
    </main>

    <EventModal 
      v-if="isModalOpen"
      :isOpen="isModalOpen" 
      :event="selectedEvent" 
      @close="closeModal" 
      @create-order="prepareCreateOrder"
    />

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
import { ref, onMounted, computed } from 'vue'; 
import EventCard from '../components/EventCard.vue';
import EventModal from '../components/EventModal.vue';
import ConfirmationModal from '@/components/ConfirmationModal.vue';
import { TicketIcon } from '@heroicons/vue/24/outline';
import { getEvents } from '../services/eventsService';
import { createOrder } from '../services/ordersService';
import { useAuth } from '../composables/useAuth';
import { useNotifications } from '../composables/useNotifications';

// استلام حالة الدارك مود من الأب
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

// --- تصفية مزدوجة: الفعاليات المقبولة + البحث الذكي بحسب العنوان ---
const filteredEvents = computed(() => {
  return events.value.filter(event => {
    const isApproved = event.status === 'approved';
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.value.toLowerCase());
    return isApproved && matchesSearch;
  });
});

// --- Fetch events from backend ---
async function fetchEvents() {
  isLoading.value = true;
  error.value = null;
  try {
    const res = await getEvents();
    events.value = res.data.data || [];
  } catch (err) {
    error.value = 'Failed to load events. Please try again later.';
    console.error(err);
  } finally {
    isLoading.value = false;
  }
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