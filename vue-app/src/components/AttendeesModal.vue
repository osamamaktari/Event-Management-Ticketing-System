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
          <!-- We reuse the AttendeesTable component here -->
          <AttendeesTable :tickets="event.tickets" @check-in="handleCheckIn" />
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
import AttendeesTable from '../components/AttendeesTable.vue';

defineProps({
  isOpen: Boolean,
  event: { type: Object, required: true }
});

const emit = defineEmits(['close']);

function handleCheckIn(ticketId) {
  // Simulation
  alert(`(Simulation) Checking in ticket ID: ${ticketId}`);
  console.log('Checking in ticket:', ticketId);
}

function close() {
  emit('close');
}
</script>
