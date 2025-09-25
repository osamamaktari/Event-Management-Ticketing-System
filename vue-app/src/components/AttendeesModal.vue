<template>
  <transition name="fade">
    <div v-if="isOpen" class="fixed inset-0 z-40 flex items-center justify-center bg-black/70" @click.self="close">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg max-w-4xl w-full m-4 max-h-[90vh] flex flex-col">
        <!-- Header -->
        <div class="p-5 border-b dark:border-gray-700">
          <h3 class="text-xl font-bold text-gray-900 dark:text-white">Attendees for "{{ event.title }}"</h3>
        </div>

        <!-- Body -->
        <div class="p-6 overflow-y-auto">
          <AttendeesTable :tickets="tickets" @check-in="handleCheckIn" />
        </div>

        <!-- Footer -->
        <div class="p-5 border-t dark:border-gray-700 flex justify-end">
          <button @click="close" class="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 dark:bg-gray-600">Close</button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, watch } from 'vue';
import AttendeesTable from '../components/AttendeesTable.vue';
import { getEventTickets } from '../services/eventsService.js';

const props = defineProps({
  isOpen: Boolean,
  event: { type: Object, required: true }
});

const emit = defineEmits(['close']);

const tickets = ref([]);
const isLoading = ref(false);

// Watch the modal open state and event changes
watch(
  () => [props.isOpen, props.event],
  async ([open, newEvent]) => {
    if (open && newEvent?.id) {
      isLoading.value = true;
      try {
        const res = await getEventTickets(newEvent.id);
        tickets.value = res.data || []; 
      } catch (err) {
        console.error('Failed to load tickets:', err);
        tickets.value = [];
      } finally {
        isLoading.value = false;
      }
    }
  },
  { immediate: true }
);

function handleCheckIn(ticketId) {
  alert(`(Simulation) Checking in ticket ID: ${ticketId}`);
}

function close() {
  emit('close');
}
</script>
