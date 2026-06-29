<template>
  <div class="p-6 max-w-7xl mx-auto">
    <div class="sm:flex sm:items-center sm:justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Event Attendees</h1>
        <p class="mt-2 text-sm text-gray-700 dark:text-gray-400">Select an event to view its registered attendees.</p>
      </div>
    </div>

    <div class="mb-6 max-w-xs">
      <label for="event-select" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Choose Event</label>
      <select 
        id="event-select" 
        v-model="selectedEventId" 
        @change="fetchAttendees"
        class="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white focus:border-indigo-500 focus:ring-indigo-500"
      >
        <option value="" disabled>-- Select an Event --</option>
        <option v-for="event in events" :key="event.id" :value="event.id">
          {{ event.title }}
        </option>
      </select>
    </div>

    <div v-if="isLoading" class="text-center py-12 text-gray-500 dark:text-gray-400">
      Loading data...
    </div>

    <div v-else-if="error" class="bg-red-50 dark:bg-red-950/30 text-red-600 p-4 rounded-xl text-center mb-6">
      {{ error }}
    </div>

    <div v-if="selectedEventId && !isLoading" class="bg-white dark:bg-gray-800 shadow-md rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead class="bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm uppercase font-semibold">
            <tr>
              <th class="px-6 py-4">Attendee Name</th>
              <th class="px-6 py-4">Email</th>
              <th class="px-6 py-4">Ticket Type</th>
              <th class="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700 text-sm text-gray-600 dark:text-gray-300">
            <tr v-for="ticket in attendees" :key="ticket.id" class="hover:bg-gray-50 dark:hover:bg-gray-700/50">
              <td class="px-6 py-4 font-medium text-gray-900 dark:text-white">
                {{ ticket.attendee?.name || 'N/A' }}
              </td>
              <td class="px-6 py-4">
                {{ ticket.attendee?.email || 'N/A' }}
              </td>
              <td class="px-6 py-4 text-indigo-600 dark:text-indigo-400 font-medium">
                {{ ticket.ticket_type?.name || ticket.ticketType?.name || 'Standard' }}
              </td>
              <td class="px-6 py-4">
                <span :class="[
                  'px-2.5 py-1 text-xs font-semibold rounded-full',
                  ticket.status === 'validated' || ticket.status === 'paid' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                ]">
                  {{ ticket.status || 'Active' }}
                </span>
              </td>
            </tr>
            <tr v-if="attendees.length === 0">
              <td colspan="4" class="text-center py-12 text-gray-500 dark:text-gray-400">No attendees registered for this event yet.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-else-if="!selectedEventId" class="text-center py-12 bg-gray-50 dark:bg-gray-800/50 border border-dashed border-gray-300 dark:border-gray-700 rounded-xl text-gray-500 dark:text-gray-400">
      Please select an event from the list above to view its attendees.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getOrganizerEvents, getEventAttendees } from '../services/ticketsService';

const events = ref([]);
const attendees = ref([]);
const selectedEventId = ref('');
const isLoading = ref(false);
const error = ref(null);

onMounted(async () => {
  isLoading.value = true;
  try {
    const res = await getOrganizerEvents();
    events.value = res.data.data; 
  } catch (err) {
    error.value = 'Failed to load events list.';
    console.error(err);
  } finally {
    isLoading.value = false;
  }
});

async function fetchAttendees() {
  if (!selectedEventId.value) return;
  isLoading.value = true;
  error.value = null;
  try {
    const res = await getEventAttendees(selectedEventId.value);
  
    // console.log("Tickets Data from API:", res.data);
    
    attendees.value = res.data; 
  } catch (err) {
    error.value = 'Failed to load attendees for the selected event.';
    console.error(err);
  } finally {
    isLoading.value = false;
  }
}
</script>