<template>
  <div class="p-4 sm:p-6 md:p-8">
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
      <h2 class="text-3xl font-bold text-gray-900 dark:text-white">Manage Events</h2>
      <button @click="openEventModal()" class="bg-indigo-600 text-white px-2 py-1.5 rounded-lg hover:bg-indigo-700 font-semibold shadow">
        + Create New Event
      </button>
    </div>

    <!-- Loading and Error States -->
    <div v-if="isLoading" class="text-center text-gray-500 py-10">Loading your events...</div>
    <div v-else-if="error" class="text-center text-red-500 bg-red-100 p-4 rounded-lg">{{ error }}</div>

    <!-- Events List -->
    <div v-else-if="events.length" class="space-y-4">
      <div v-for="event in events" :key="event.id" class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div class="flex-grow">
          <h3 class="font-bold text-lg text-gray-900 dark:text-white">{{ event.title }}</h3>
                 <!-- Status Change Dropdown & Button (Admin only) -->
<div v-if="currentUser?.role === 'admin'" class="flex items-center gap-2 m-2">
  <select v-model="event.newStatus" class=" rounded  text-white text-md bg-indigo-700">
    <option value="approved">Approved</option>
    <option value="pending">Pending</option>
    <option value="rejected">Rejected</option>
    <option value="cancelled">Cancelled</option>
  </select>
  <button 
    @click="changeStatus(event)"
    class="text-sm bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-1 py-1 rounded-md font-semibold"
  >
    Update Status
  </button>
</div>
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
          <button @click="openAttendeesModal(event)" class="text-sm bg-gray-200 dark:bg-gray-700 px-2 py-1.5 dark:text-white rounded-md font-semibold">View Attendees</button>
          <button @click="openTicketTypesModal(event)" class="text-sm bg-gray-200 dark:bg-gray-700 px-2 py-1.5 dark:text-white rounded-md font-semibold">Manage Tickets</button>
          <button @click="openEventModal(event)" class="text-sm bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-2 py-1.5 rounded-md font-semibold">Edit</button>
          <button @click="confirmDeleteEvent(event)" class="text-sm bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 px-2 py-1.5 rounded-md font-semibold">Delete</button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center text-gray-500 border-2 border-dashed p-12 rounded-lg">
      <p class="text-xl font-semibold">You haven't created any events yet.</p>
      <p>Click the button above to get started.</p>
    </div>

    <!-- Modals Section -->
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
      v-if="isAttendeesModalOpen"
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
import api from '../services/api.js';

// Initialize toast notifications
const { showSuccess, showError } = useNotifications();
// to select the user 
const currentUser = ref(JSON.parse(localStorage.getItem('user')) || null);


// Component state
const events = ref([]); // Stores all events visible to current user
const isLoading = ref(true);
const error = ref(null);

// Modal state
const isEventModalOpen = ref(false);
const isTicketTypesModalOpen = ref(false);
const isAttendeesModalOpen = ref(false);
const isConfirmModalOpen = ref(false);
const selectedEvent = ref(null);
const eventToHandle = ref(null);

// Fetch events from API based on user role
// async function fetchOrganizerEvents() {
//   isLoading.value = true;
//   error.value = null;

//   try {
//     const res = await getOrganizerEvents();

//     // Get current user from localStorage or store
//     const currentUser = JSON.parse(localStorage.getItem('user'));

//     // Admin sees all events, organizer sees only their own
//     if (currentUser.role === 'admin') {
//       events.value = res.data.data || [];
//     } else {
//       events.value = (res.data.data || []).filter(
//         event => event.organizer_id === currentUser.id
//       );
//     }

//   } catch (err) {
//     console.error(err);
//     error.value = err.response?.data?.message || 'Failed to load your events.';
//   } finally {
//     isLoading.value = false;
//   }
// }
async function fetchOrganizerEvents() {
  isLoading.value = true;
  error.value = null;

  try {
    const res = await getOrganizerEvents();
    const currentUser = JSON.parse(localStorage.getItem('user'));

    // Filter events based on role
    let loadedEvents = currentUser.role === 'admin'
      ? res.data.data || []
      : (res.data.data || []).filter(event => event.organizer_id === currentUser.id);

    // Add `newStatus` property to each event for admin dropdown
    events.value = loadedEvents.map(ev => ({
      ...ev,
      newStatus: ev.status 
    }));

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

// Helper function for status badge styles
function statusBadgeClass(status) {
  const styles = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
    approved: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
    rejected: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
    cancelled: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
  };
  return styles[status] || styles.cancelled;
}

// change status
async function changeStatus(event) {
  if (!event.newStatus) return;

  try {
    const res = await api.post(`/admin/events/${event.id}/status`, 
      { status: event.newStatus }, 
      { withCredentials: true }
    );


    const index = events.value.findIndex(e => e.id === event.id);
    if (index !== -1) events.value[index].status = res.data.status;

    showSuccess(`Event "${event.title}" status updated to "${res.data.status}".`);
  } catch (err) {
    console.error(err);
    showError(err.response?.data?.message || 'Failed to update status.');
  }
}

// Lifecycle hook to fetch events on component mount
onMounted(() => {
  fetchOrganizerEvents();
});
</script>
