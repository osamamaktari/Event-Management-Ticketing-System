<template>
  <transition name="fade">
    <div v-if="isOpen" class="fixed inset-0 z-40 flex items-center justify-center bg-black/70" @click.self="close">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg max-w-4xl w-full m-4 max-h-[90vh] flex flex-col">
        <div class="p-5 border-b dark:border-gray-700">
          <h3 class="text-xl font-bold text-gray-900 dark:text-white">Attendees for "{{ event.title }}"</h3>
        </div>

        <div class="p-6 overflow-y-auto">
          <div v-if="isLoading" class="text-center py-6 text-gray-500">
            Loading attendees...
          </div>
          
          <div v-else-if="error" class="text-center py-6 text-red-500">
            {{ error }}
          </div>

          <AttendeesTable v-else :tickets="tickets" @check-in="handleCheckIn" />
        </div>

        <div class="p-5 border-t dark:border-gray-700 flex justify-end">
          <button @click="close" class="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white">Close</button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, watch } from 'vue';
import AttendeesTable from '../components/AttendeesTable.vue';
import { getEventAttendees } from '../services/ticketsService'; // 🌟 استيراد خدمة جلب التذاكر

const props = defineProps({
  isOpen: Boolean,
  event: { type: Object, required: true }
});

const emit = defineEmits(['close']);

const tickets = ref([]);
const isLoading = ref(false);
const error = ref(null);

// 🌟 مراقبة فتح المودال: أول ما يفتح (isOpen يصبح true) يروح يجلب البيانات فوراً من الباكيند
watch(() => props.isOpen, async (newVal) => {
  if (newVal && props.event?.id) {
    isLoading.value = true;
    error.value = null;
    try {
      const res = await getEventAttendees(props.event.id);
      tickets.value = res.data; // استقبال التذاكر بنجاح
    } catch (err) {
      error.value = "Failed to load attendees.";
      console.error(err);
    } finally {
      isLoading.value = false;
    }
  }
});

function handleCheckIn(ticketId) {
  alert(`(Simulation) Checking in ticket ID: ${ticketId}`);
  console.log('Checking in ticket:', ticketId);
}

function close() {
  emit('close');
}
</script>