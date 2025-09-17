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
    
    <div v-else class="text-center text-gray-500 border-2 border-dashed p-12 rounded-lg">
      <p class="text-xl font-semibold">You haven't created any events yet.</p>
      <p>Click the button above to get started.</p>
    </div>

    <!-- Modals Section -->
    <EventFormModal 
      :isOpen="isEventModalOpen" 
      :event="selectedEvent" 
      @close="closeEventModal" 
      @save="handleSaveEvent" 
    />
    <TicketTypesModal 
      :isOpen="isTicketTypesModalOpen" 
      :event="selectedEvent" 
      @close="closeTicketTypesModal" 
    />
    <AttendeesModal 
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

    <!-- Notification Modal for success/error messages -->
    <ConfirmationModal
      :isOpen="isNotifyOpen"
      :type="notifyType"
      :title="notifyTitle"
      :message="notifyMessage"
      confirmText="OK"
      :showCancel="false"
      @confirm="isNotifyOpen = false"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// --- Import Modals ---
// Assuming all components are in the same 'src/components/' folder
import EventFormModal from '../components/EventFormModal.vue';
import TicketTypesModal from '../components/TicketTypesModal.vue';
import AttendeesModal from '../components/AttendeesModal.vue';
import ConfirmationModal from '../components/ConfirmationModal.vue';

// --- 1. Mock Data for Frontend Development (This is the crucial part) ---
const mockOrganizerEvents = [
  { 
    id: 1, 
    title: 'My Awesome Concert', 
    description: 'A great concert featuring the best artists in town. Get ready for an unforgettable night of music and fun.',
    venue: 'City Arena', 
    start_date: '2025-10-01T19:00:00', 
    end_date: '2025-10-01T23:00:00', 
    banner_url: 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?q=80&w=2070&auto=format&fit=crop', 
    status: 'approved',
    ticket_types: [
      {id: 1, name: 'VIP', price: 100, quantity: 50, sold: 10},
      {id: 2, name: 'Standard', price: 50, quantity: 200, sold: 85},
    ],
    tickets: [
      {id: 101, attendee: {name: 'John Doe', email: 'john@example.com'}, ticket_type: {name: 'VIP'}, status: 'active'},
      {id: 102, attendee: {name: 'Jane Smith', email: 'jane@example.com'}, ticket_type: {name: 'VIP'}, status: 'used'},
      {id: 103, attendee: {name: 'Peter Jones', email: 'peter@example.com'}, ticket_type: {name: 'Standard'}, status: 'active'},
    ]
  },
  { 
    id: 2, 
    title: 'My Tech Meetup', 
    description: 'A meetup for developers interested in the latest web technologies. Networking and learning opportunities.',
    venue: 'The Tech Hub', 
    start_date: '2025-11-05T09:00:00', 
    end_date: null, 
    banner_url: null, 
    status: 'pending',
    ticket_types: [],
    tickets: []
  },
];

// --- Component State ---
const organizerEvents = ref([] );
const isLoading = ref(true);
const error = ref(null);

// --- Modal State ---
const isEventModalOpen = ref(false);
const isTicketTypesModalOpen = ref(false);
const isAttendeesModalOpen = ref(false);
const isConfirmModalOpen = ref(false);
const selectedEvent = ref(null);
const eventToHandle = ref(null);

// --- Notification Modal State ---
const isNotifyOpen = ref(false);
const notifyType = ref('success');
const notifyTitle = ref('');
const notifyMessage = ref('');

// --- Data Fetching ---
onMounted(async () => {
  await fetchMockData();
});

// --- MOCK FUNCTION (for frontend only) ---
async function fetchMockData() {
  isLoading.value = true;
  await new Promise(resolve => setTimeout(resolve, 1000));
  // This line assigns the mock data to the reactive ref, which updates the UI
  organizerEvents.value = mockOrganizerEvents;
  isLoading.value = false;
}

// --- Modal Control ---
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

// --- CRUD Operations (Simulated) ---
async function handleSaveEvent(formData) {
  console.log('Saving event with data:', Object.fromEntries(formData.entries()));
  closeEventModal();
  
  notifyType.value = 'success';
  notifyTitle.value = 'Event Saved';
  notifyMessage.value = `(Simulation) The event has been saved successfully.`;
  isNotifyOpen.value = true;

  await fetchMockData();
}

function confirmDeleteEvent(event) {
  eventToHandle.value = event;
  isConfirmModalOpen.value = true;
}

async function handleDeleteEvent() {
  console.log('Deleting event:', eventToHandle.value.id);
  isConfirmModalOpen.value = false; 

  notifyType.value = 'success';
  notifyTitle.value = 'Event Deleted';
  notifyMessage.value = `(Simulation) The event "${eventToHandle.value.title}" has been deleted.`;
  isNotifyOpen.value = true;

  await fetchMockData();
}

// --- Helper Functions ---
function statusBadgeClass(status) {
  const styles = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
    approved: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
    rejected: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
    cancelled: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
  };
  return styles[status] || styles.cancelled;
}
</script>
