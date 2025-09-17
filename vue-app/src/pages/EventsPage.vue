<template>
  <div class="p-4 sm:p-6 md:p-8">
    <h2 class="text-3xl font-bold mb-6 text-gray-900 dark:text-white">All Events</h2>

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
    <div v-else-if="events.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <EventCard 
        v-for="event in events" 
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
import { ref, onMounted } from 'vue';
import EventCard from '../components/EventCard.vue';
import EventModal from '../components/EventModal.vue';
import ConfirmationModal from '@/components/ConfirmationModal.vue';
// --- Import your API services here when ready ---
// import { getEvents } from '../services/eventsService'; 
// import { createOrder } from '../services/ordersService';
// import { useAuth } from '../composables/useAuth'; 


const isConfirmModalOpen = ref(false);
const confirmModalType = ref('confirm'); // 'confirm', 'success', 'error'
const confirmModalTitle = ref('');
const confirmModalMessage = ref('');
const confirmModalActionText = ref('Confirm');
const confirmModalShowCancel = ref(true);
const pendingOrderPayload = ref(null); 



function prepareCreateOrder(orderPayload) {
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


function executeOrder() {
  isConfirmModalOpen.value = false; 
  console.log('Order confirmed! Payload:', pendingOrderPayload.value);


  showSuccessModal(); 
  
  
}


function cancelOrder() {
  isConfirmModalOpen.value = false;
  pendingOrderPayload.value = null; 
  console.log('Order cancelled by user.');
}


function showSuccessModal() {
  confirmModalType.value = 'success';
  confirmModalTitle.value = 'Purchase Successful!';
  confirmModalMessage.value = 'Your tickets have been confirmed. You can view them in the "My Tickets" section.';
  confirmModalActionText.value = 'Great!';
  confirmModalShowCancel.value = false; 
  isConfirmModalOpen.value = true;
}

function showErrorModal(message) {
  confirmModalType.value = 'error';
  confirmModalTitle.value = 'Purchase Failed';
  confirmModalMessage.value = message;
  confirmModalActionText.value = 'Close';
  confirmModalShowCancel.value = false;
  isConfirmModalOpen.value = true;
}


// --- Component State ---
const events = ref([]);
const isLoading = ref(true);
const error = ref(null);
const selectedEvent = ref(null);
const isModalOpen = ref(false);

// const { user } = useAuth(); // Uncomment when auth is integrated

// --- Mock Data for Frontend Development ---
const mockEvents = [
  { 
    id: 1, 
    title: 'Epic Music Concert', 
    description: 'A night of live music featuring international artists. Get ready to experience an unforgettable evening under the stars.', 
    venue: 'City Arena', 
    start_date: '2025-10-01T19:00:00', 
    end_date: '2025-10-01T23:00:00',
    banner_url: 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?q=80&w=2070&auto=format&fit=crop',
    ticket_types:[
      {id:1, name:'VIP', price:100, quantity:50, sold: 10},
      {id:2, name:'Standard', price:50, quantity:200, sold: 85}
    ] 
  },
  { 
    id: 2, 
    title: 'Future of Tech Conference', 
    description: 'Join industry leaders to learn about the future of Vue 3, Laravel, and AI. A must-attend for all developers.', 
    venue: 'Grand Tech Hall', 
    start_date: '2025-11-05T09:00:00', 
    end_date: '2025-11-06T17:00:00',
    banner_url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=2062&auto=format&fit=crop',
    ticket_types:[
      {id:3, name:'All-Access Pass', price:300, quantity:250, sold: 150},
      {id:4, name:'Student Pass', price:75, quantity:100, sold: 98}
    ] 
  },
  { 
    id: 3, 
    title: 'Art & Design Expo', 
    description: 'Explore stunning creations from local and international artists. Workshops and live demonstrations available.', 
    venue: 'The Creative Hub', 
    start_date: '2025-12-10T10:00:00', 
    end_date: null,
    banner_url: null, // Example with no banner
    ticket_types:[
      {id:5, name:'General Admission', price:25, quantity:500, sold: 498},
    ] 
  },
];

// --- Data Fetching ---
onMounted(async ( ) => {
  // To work with the backend, replace the mock function with the real API call.
  await fetchMockData();
  // await fetchApiData(); // UNCOMMENT THIS LINE TO USE THE REAL API
});

// --- MOCK FUNCTION (for frontend only) ---
async function fetchMockData() {
  isLoading.value = true;
  error.value = null;
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000)); 
  events.value = mockEvents;
  isLoading.value = false;
}

/*
// --- REAL API FUNCTION (use when backend is ready) ---
async function fetchApiData() {
  isLoading.value = true;
  error.value = null;
  try {
    const response = await getEvents();
    events.value = response.data;
  } catch (err) {
    error.value = 'Failed to load events. Please try again later.';
    console.error(err);
  } finally {
    isLoading.value = false;
  }
}
*/

// --- Modal Handling ---
function openModal(event) {
  selectedEvent.value = event;
  isModalOpen.value = true;
}

function closeModal() {
  isModalOpen.value = false;
}

// --- Order Creation ---
function handleCreateOrder(orderPayload) {
  // For now, we just simulate the order creation
  console.log('Creating order with payload:', orderPayload);
  alert(`Order submitted for event: "${selectedEvent.value.title}"! Check the console for details.`);
  
  /*
  // --- REAL ORDER CREATION LOGIC (use when backend is ready) ---
  if (!user.value) {
    alert('Please log in to purchase tickets.');
    // You can redirect to login page here: router.push('/login');
    return;
  }

  try {
    const response = await createOrder(selectedEvent.value.id, orderPayload);
    alert(`Order created successfully! Order ID: ${response.data.order_id}`);
    closeModal();
  } catch (err) {
    alert('Failed to create order: ' + (err.response?.data?.message || 'Please try again.'));
    console.error(err);
  }
  */
  
  closeModal();
}
</script>
