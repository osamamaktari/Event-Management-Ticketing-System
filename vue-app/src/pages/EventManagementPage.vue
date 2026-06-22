<template>
  <div class="p-4 sm:p-6 md:p-8">
    <div class="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
      <h2 class="text-3xl font-bold text-gray-900 dark:text-white">
        {{ isAdmin() ? 'Manage All Events (Admin)' : 'Manage Events' }}
      </h2>
      <button v-if="!isAdmin()" @click="openEventModal()" class="bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 font-semibold shadow">
        + Create New Event
      </button>
    </div>

    <div v-if="isLoading" class="text-center text-gray-500 py-10">Loading events...</div>
    <div v-else-if="error" class="text-center text-red-500 bg-red-100 p-4 rounded-lg">{{ error }}</div>

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
        
        <div class="flex items-center gap-2 flex-shrink-0 flex-wrap">
          
          <template v-if="isAdmin()">
            <button 
              v-if="event.status !== 'approved'" 
              @click="handleUpdateStatus(event.id, 'approved')" 
              class="text-sm bg-green-600 text-white px-3 py-2 rounded-md font-semibold hover:bg-green-700 transition">
             Approve
            </button>
            <button 
              v-if="event.status !== 'rejected'" 
              @click="handleUpdateStatus(event.id, 'rejected')" 
              class="text-sm bg-red-600 text-white px-3 py-2 rounded-md font-semibold hover:bg-red-700 transition">
             Reject
            </button>
            <button 
              v-if="event.status !== 'pending'" 
              @click="handleUpdateStatus(event.id, 'pending')" 
              class="text-sm bg-yellow-500 text-white px-3 py-2 rounded-md font-semibold hover:bg-yellow-600 transition">
             Pend
            </button>
          </template>

          <button @click="openAttendeesModal(event)" class="text-sm bg-gray-200 dark:bg-gray-700 px-3 py-2 rounded-md font-semibold">View Attendees</button>
          <button @click="openTicketTypesModal(event)" class="text-sm bg-gray-200 dark:bg-gray-700 px-3 py-2 rounded-md font-semibold">Manage Tickets</button>
          <button @click="openEventModal(event)" class="text-sm bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-3 py-2 rounded-md font-semibold">Edit</button>
          <button @click="confirmDeleteEvent(event)" class="text-sm bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 px-3 py-2 rounded-md font-semibold">Delete</button>
        </div>
      </div>
    </div>

    <div v-else class="text-center text-gray-500 border-2 border-dashed p-12 rounded-lg">
      <p class="text-xl font-semibold">No events found.</p>
      <p v-if="!isAdmin()">Click the button above to get started.</p>
    </div>

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

// استيراد الصلاحيات والدوال الجديدة من ملف الخدمات
import { useAuth } from '../composables/useAuth.js';
import { 
  getOrganizerEvents, 
  getAdminEvents, 
  updateEventStatus, 
  createEvent, 
  updateEvent, 
  deleteEvent 
} from '../services/eventsService.js';

// Initialize toast notifications
const { showSuccess, showError } = useNotifications();
const { isAdmin } = useAuth();

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

// Fetch events from API (Checks role dynamically)
async function fetchOrganizerEvents() {
  isLoading.value = true;
  error.value = null;
  try {
    const res = isAdmin() ? await getAdminEvents() : await getOrganizerEvents();
    organizerEvents.value = res.data.data || [];
  } catch (err) {
    console.error(err);
    error.value = err.response?.data?.message || 'Failed to load events.';
  } finally {
    isLoading.value = false;
  }
}

// Admin function to handle event status changes
async function handleUpdateStatus(eventId, status) {
  try {
    await updateEventStatus(eventId, status);
    showSuccess(`Event status successfully updated to [${status}].`);
    await fetchOrganizerEvents();
  } catch (err) {
    console.error(err);
    showError(err.response?.data?.message || 'Failed to update event status.');
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
    isConfirmModalOpen = false;
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