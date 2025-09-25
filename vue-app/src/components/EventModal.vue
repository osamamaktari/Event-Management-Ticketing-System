<template>
  <transition name="fade">
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/70" @click.self="close">
      <div class="bg-white dark:bg-gray-800 rounded-xl max-w-lg w-full m-4 max-h-[90vh] flex flex-col">
       
        <img v-if="imageUrl" 
     :src="imageUrl" 
     alt="Event banner" 
     class="w-40 h-40 object-cover   rounded-t-xl">

        <!-- Modal Header -->
        <div class="p-6 border-b dark:border-gray-700">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">{{ event.title }}</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{ event.venue }}</p>
        </div>

        <!-- Modal Body (Scrollable) -->
        <div class="p-6 overflow-y-auto">
          <p class="text-gray-600 dark:text-gray-300 mb-6">{{ event.description }}</p>
          
          <!-- Tickets Section -->
          <div v-if="event.ticket_types?.length">
            <h3 class="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Select Tickets</h3>
            <ul class="space-y-3">
              <li v-for="ticketType in event.ticket_types" :key="ticketType.id" class="flex justify-between items-center border dark:border-gray-700 p-3 rounded-lg">
                <div>
                  <span class="font-semibold text-gray-800 dark:text-gray-200">{{ ticketType.name }}</span>
                  <span class="text-sm text-gray-600 dark:text-gray-400"> - ${{ ticketType.price }}</span>
                  <p class="text-xs text-green-600 dark:text-green-400 mt-1">Available: {{ ticketType.quantity - (ticketType.sold || 0) }}</p>
                </div>
                <div class="flex items-center gap-2">
                  <button @click="updateQuantity(ticketType.id, -1)" class="px-2.5 py-1 bg-gray-200 dark:bg-gray-600 rounded-md font-bold disabled:opacity-50" :disabled="(quantities[ticketType.id] || 0) === 0">-</button>
                  <span class="w-8 text-center font-semibold text-lg dark:text-white">{{ quantities[ticketType.id] || 0 }}</span>
                  <button @click="updateQuantity(ticketType.id, 1)" class="px-2.5 py-1 bg-gray-200 dark:bg-gray-600 rounded-md font-bold disabled:opacity-50" :disabled="(quantities[ticketType.id] || 0) >= (ticketType.quantity - (ticketType.sold || 0))">+</button>
                </div>
              </li>
            </ul>
          </div>
          <p v-else class="text-center text-gray-500 mt-4 border-2 border-dashed dark:border-gray-600 p-6 rounded-lg">No tickets available for this event.</p>
        </div>

        <!-- Modal Footer -->
        <div class="p-6 border-t dark:border-gray-700 mt-auto">
          <div class="flex justify-between items-center mb-4">
            <span class="text-lg font-medium text-gray-600 dark:text-gray-300">Total:</span>
            <span class="text-2xl font-bold text-gray-900 dark:text-white">${{ totalAmount }}</span>
          </div>
          <button 
            @click="submitOrder" 
            :disabled="totalAmount === 0"
            class="w-full bg-indigo-600 text-white px-4 py-3 rounded-lg font-semibold text-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed">
            Buy Tickets
          </button>
        </div>
        
        <!-- Close Button -->
        <button @click="close" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
// 1. Import the notifications composable
import { useNotifications } from '../composables/useNotifications.js';

// 2. Initialize the composable
const { showInfo } = useNotifications( );

const backendUrl = 'http://127.0.0.1:8000'; 

const imageUrl = computed(( ) => {
  if (props.event.banner_url) {
    return `${backendUrl}/storage/${props.event.banner_url}`;
  }
  return null;
});



const props = defineProps({
  isOpen: { type: Boolean, default: false },
  event: { type: Object, required: true }
});

const emit = defineEmits(['close', 'create-order']);

const quantities = ref({});

// Reset quantities when the modal opens with a new event
watch(() => props.event, () => {
  quantities.value = {};
}, { immediate: true });

// Calculate the total amount based on selected quantities
const totalAmount = computed(() => {
  if (!props.event.ticket_types) return 0;
  return props.event.ticket_types.reduce((total, type) => {
    const quantity = quantities.value[type.id] || 0;
    return total + (quantity * type.price);
  }, 0);
});

// Update the quantity for a specific ticket type
function updateQuantity(ticketTypeId, change) {
  const currentQuantity = quantities.value[ticketTypeId] || 0;
  const newQuantity = currentQuantity + change;
  
  const ticketType = props.event.ticket_types.find(t => t.id === ticketTypeId);
  const available = ticketType.quantity - (ticketType.sold || 0);

  // Ensure quantity is within valid range [0, available]
  if (newQuantity >= 0 && newQuantity <= available) {
    quantities.value[ticketTypeId] = newQuantity;

    // 3. Show an info toast when a ticket is added or removed
    if (change > 0) {
      showInfo(`Added 1 "${ticketType.name}" ticket.`);
    }
  }
}

// Assemble the order payload and emit it to the parent
function submitOrder() {
  const items = Object.entries(quantities.value)
    .filter(([_, quantity]) => quantity > 0)
    .map(([ticket_type_id, quantity]) => ({
      ticket_type_id: parseInt(ticket_type_id),
      quantity
    }));

  if (items.length > 0) {
    emit('create-order', { items });
  }
  
}

function close() {
  emit('close');
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
