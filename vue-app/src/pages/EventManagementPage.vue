<template>
  <div class="p-4 sm:p-6 md:p-8">
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
      <h2 class="text-3xl font-bold text-gray-900 dark:text-white">Manage Events</h2>
      <button @click="openEventModal()" class="bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 font-semibold shadow">
        + Create New Event
      </button>
    </div>

    <!-- Loading and Error States -->
    <div v-if="isLoading" class="text-center text-gray-500 py-10">Loading your events...</div>
    <div v-else-if="error" class="text-center text-red-500 bg-red-100 p-4 rounded-lg">{{ error }}</div>

    <!-- Events List -->
    <div v-else-if="organizerEvents.length" class="space-y-4">
      <div v-for="event in organizerEvents" :key="event.id" class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div class="flex-grow">
          <h3 class="font-bold text-lg text-gray-900 dark:text-white">{{ event.title }}</h3>
          <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-1">
            <span>{{ new Date(event.start_date).toLocaleDateString() }}</span>
            <span class="text-gray-300 dark:text-gray-600">•</span>
            <span :class="statusBadgeClass(event.status)" class="text-xs font-medium px-2.5 py-0.5 rounded-full">
              {{ event.status }}
            </span>
          </div>
        </div>
        <!-- Action Buttons -->
        <div class="flex items-center gap-2 flex-shrink-0 flex-wrap">
          <button @click="openAttendeesModal(event)" class="text-sm bg-gray-200 dark:bg-gray-700 px-3 py-2 rounded-md font-semibold">View Attendees</button>
          <button @click="openTicketTypesModal(event)" class="text-sm bg-gray-200 dark:bg-gray-700 px-3 py-2 rounded-md font-semibold">Manage Tickets</button>
          <button @click="openEventModal(event)" class="text-sm bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-3 py-2 rounded-md font-semibold">Edit</button>
          <button @click="confirmDeleteEvent(event)" class="text-sm bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 px-3 py-2 rounded-md font-semibold">Delete</button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center text-gray-500 border-2 border-dashed p-12 rounded-lg">
      <p class="text-xl font-semibold">You haven't created any events yet.</p>
      <p>Click the button above to get started.</p>
    </div>

    <!-- Modals Section -->
    <!-- Only show modal if selectedEvent exists to prevent prop type errors -->
    <EventFormModal 
      :isOpen="isEventModalOpen" 
      :event="selectedEvent || {}" 
      @close="closeEventModal" 
      @save="handleSaveEvent" 
    />
    <TicketTypesModal 
      v-if="selectedEvent"
      :isOpen="isTicketTypesModalOpen" 
      :event="selectedEvent" 
      @close="closeTicketTypesModal" 
    />
    <AttendeesModal 
      v-if="selectedEvent"
      :isOpen="isAttendeesModalOpen" 
      :event="selectedEvent" 
      @close="closeAttendeesModal" 
    />

    <!-- Deletion Confirmation Modal -->
    <ConfirmationModal
      :isOpen="isConfirmModalOpen"
      type="confirm"
      title="Confirm Deletion"
      :message="`Are you sure you want to delete the event '${eventToHandle?.title}'? This action cannot be undone.`"
      @confirm="handleDeleteEvent"
      @cancel="isConfirmModalOpen = false"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import EventFormModal from '../components/EventFormModal.vue';
import TicketTypesModal from '../components/TicketTypesModal.vue';
import AttendeesModal from '../components/AttendeesModal.vue';
import ConfirmationModal from '../components/ConfirmationModal.vue';
import { useNotifications } from '../composables/useNotifications.js';
import { getOrganizerEvents, createEvent, updateEvent, deleteEvent } from '../services/eventsService.js';

// Initialize toast notifications
const { showSuccess, showError } = useNotifications();

// Component state
const organizerEvents = ref([]);
const isLoading = ref(true);
const error = ref(null);

// Modal state
const isEventModalOpen = ref(false);
const isTicketTypesModalOpen = ref(false);
const isAttendeesModalOpen = ref(false);
const isConfirmModalOpen = ref(false);
const selectedEvent = ref(null);
const eventToHandle = ref(null);

// Fetch organizer events from API
async function fetchOrganizerEvents() {
  isLoading.value = true;
  error.value = null;
  try {
    const res = await getOrganizerEvents();
    organizerEvents.value = res.data.data || [];
  } catch (err) {
    console.error(err);
    error.value = err.response?.data?.message || 'Failed to load your events.';
  } finally {
    isLoading.value = false;
  }
}

// Modal control functions
function openEventModal(event = null) {
  selectedEvent.value = event;
  isEventModalOpen.value = true;
}
function closeEventModal() { isEventModalOpen.value = false; }

function openTicketTypesModal(event) {
  selectedEvent.value = event;
  isTicketTypesModalOpen.value = true;
}
function closeTicketTypesModal() { isTicketTypesModalOpen.value = false; }

function openAttendeesModal(event) {
  selectedEvent.value = event;
  isAttendeesModalOpen.value = true;
}
function closeAttendeesModal() { isAttendeesModalOpen.value = false; }

// Event CRUD functions
async function handleSaveEvent(formData) {
  try {
    if (selectedEvent.value?.id) {
      await updateEvent(selectedEvent.value.id, formData);
      showSuccess('Event updated successfully.');
    } else {
      await createEvent(formData);
      showSuccess('Event created successfully.');
    }
    closeEventModal();
    await fetchOrganizerEvents();
  } catch (err) {
    console.error(err);
    showError(err.response?.data?.message || 'Failed to save event.');
  }
}

function confirmDeleteEvent(event) {
  eventToHandle.value = event;
  isConfirmModalOpen.value = true;
}

async function handleDeleteEvent() {
  if (!eventToHandle.value) return;
  try {
    await deleteEvent(eventToHandle.value.id);
    showSuccess(`Event "${eventToHandle.value.title}" has been deleted.`);
    await fetchOrganizerEvents();
  } catch (err) {
    console.error(err);
    showError(err.response?.data?.message || 'Failed to delete event.');
  } finally {
    isConfirmModalOpen.value = false;
  }
}

// Helper function for status badge
function statusBadgeClass(status) {
  const styles = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
    approved: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
    rejected: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
    cancelled: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
  };
  return styles[status] || styles.cancelled;
}

// Lifecycle hook
onMounted(() => {
  fetchOrganizerEvents();
});
</script>
