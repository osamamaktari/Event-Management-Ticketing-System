<template>
  <div class="overflow-x-auto">
    <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
      <thead class="bg-gray-50 dark:bg-gray-700/50">
        <tr>
          <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Attendee</th>
          <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Ticket Type</th>
          <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
          <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
        </tr>
      </thead>
      <tbody v-if="tickets.length" class="divide-y divide-gray-200 dark:divide-gray-700 text-gray-800 dark:text-gray-200">
        <tr v-for="ticket in tickets" :key="ticket.id">
          <td class="px-4 py-4 whitespace-nowrap">
            <div class="font-medium">{{ ticket.attendee.name }}</div>
            <div class="text-sm text-gray-500">{{ ticket.attendee.email }}</div>
          </td>
          <td class="px-4 py-4 whitespace-nowrap text-sm">{{ ticket.ticket_type.name }}</td>
          <td class="px-4 py-4 whitespace-nowrap">
            <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" :class="statusClass(ticket.status)">
              {{ ticket.status }}
            </span>
          </td>
          <td class="px-4 py-4 whitespace-nowrap text-sm font-medium">
            <button v-if="ticket.status === 'valid'" @click="$emit('check-in', ticket.id)" class="text-indigo-600 hover:text-indigo-900">Check-in</button>
          </td>
        </tr>
      </tbody>
      <tbody v-else>
        <tr>
          <td colspan="4" class="text-center py-12 text-gray-500">No attendees yet.</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
defineProps({
  tickets: {
    type: Array,
    default: () => []
  }
});

defineEmits(['check-in']);

function statusClass(status) {
  const styles = {
    valid: 'bg-green-100 text-green-800',
    used: 'bg-yellow-100 text-yellow-800',
    cancelled: 'bg-red-100 text-red-800',
  };
  return styles[status] || 'bg-gray-100 text-gray-800';
}
</script>
