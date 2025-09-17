<template>
  <!-- 1. المودال الرئيسي لأنواع التذاكر -->
  <transition name="fade">
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/70" @click.self="close">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg max-w-2xl w-full m-4 max-h-[90vh] flex flex-col">
        <!-- Header -->
        <div class="p-5 border-b dark:border-gray-700">
          <h3 class="text-xl font-bold text-gray-900 dark:text-white">Manage Ticket Types for "{{ event.title }}"</h3>
        </div>

        <!-- Body -->
        <div class="p-6 space-y-6 overflow-y-auto">
          <!-- List of existing ticket types -->
          <div>
            <h4 class="font-semibold mb-2 dark:text-white">Existing Types</h4>
            <ul v-if="event.ticket_types?.length" class="space-y-2">
              <li v-for="tt in event.ticket_types" :key="tt.id" class="flex justify-between items-center p-3 border dark:border-gray-700 rounded-md">
                <div class="text-sm">
                  <span class="font-semibold dark:text-white">{{ tt.name }}</span>
                  <span class="text-gray-600 dark:text-gray-400"> - ${{ tt.price }} (Qty: {{ tt.quantity }})</span>
                </div>
                <button @click="confirmDelete(tt)" class="text-red-500 hover:text-red-700 font-semibold text-sm">Delete</button>
              </li>
            </ul>
            <p v-else class="text-sm text-gray-500">No ticket types created yet.</p>
          </div>

          <!-- Form to add a new ticket type -->
          <div>
            <h4 class="font-semibold mb-2 dark:text-white">Add New Type</h4>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input type="text" v-model="newType.name" placeholder="Name (e.g., VIP)" class="rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm">
              <input type="number" v-model="newType.price" placeholder="Price" class="rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm">
              <input type="number" v-model="newType.quantity" placeholder="Quantity" class="rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm">
            </div>
            <button @click="addTicketType" class="mt-3 w-full bg-indigo-600 text-white py-2 rounded-md font-semibold hover:bg-indigo-700">Add Ticket Type</button>
          </div>
        </div>

        <!-- Footer -->
        <div class="p-5 border-t dark:border-gray-700 flex justify-end">
          <button @click="close" class="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 font-semibold">Done</button>
        </div>
      </div>
    </div>
  </transition>

  <!-- 2. مودال تأكيد الحذف (مستقل وفي نفس المستوى) -->
  <ConfirmationModal
    :isOpen="isConfirmOpen"
    type="confirm"
    title="Confirm Deletion"
    :message="`Are you sure you want to delete the ticket type '${typeToDelete?.name}'?`"
    @confirm="deleteTicketType"
    @cancel="isConfirmOpen = false"
  />
  
  <!-- 3. مودال الإشعار (مستقل وفي نفس المستوى) -->
  <ConfirmationModal
    :isOpen="isNotifyOpen"
    :type="notifyType"
    :title="notifyTitle"
    :message="notifyMessage"
    confirmText="OK"
    :showCancel="false"
    @confirm="isNotifyOpen = false"
  />
</template>

<script setup>
import { ref } from 'vue';
// هذا المسار صحيح بناءً على أن الملفات في نفس المجلد
import ConfirmationModal from './ConfirmationModal.vue';

const props = defineProps({
  isOpen: Boolean,
  event: { type: Object, required: true }
});

const emit = defineEmits(['close']);

const newType = ref({ name: '', price: null, quantity: null });

// --- State for our modals ---
const isConfirmOpen = ref(false);
const typeToDelete = ref(null);
const isNotifyOpen = ref(false);
const notifyType = ref('success');
const notifyTitle = ref('');
const notifyMessage = ref('');

function addTicketType() {
  console.log('Adding ticket type:', { eventId: props.event.id, ...newType.value });
  
  notifyType.value = 'success';
  notifyTitle.value = 'Type Added';
  notifyMessage.value = `(Simulation) The ticket type "${newType.value.name}" has been added.`;
  isNotifyOpen.value = true;

  newType.value = { name: '', price: null, quantity: null };
}

function confirmDelete(ticketType) {
  typeToDelete.value = ticketType;
  isConfirmOpen.value = true;
}

function deleteTicketType() {
  console.log('Deleting ticket type:', typeToDelete.value.id);
  isConfirmOpen.value = false;

  notifyType.value = 'success';
  notifyTitle.value = 'Type Deleted';
  notifyMessage.value = `(Simulation) The ticket type "${typeToDelete.value.name}" has been deleted.`;
  isNotifyOpen.value = true;
  typeToDelete.value = null;
}

function close() {
  emit('close');
}
</script>
