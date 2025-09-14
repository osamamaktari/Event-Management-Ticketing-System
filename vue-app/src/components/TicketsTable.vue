<template>
  <div class="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
    <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
      <thead class="bg-gray-50 dark:bg-gray-700">
        <tr>
          <th class="px-4 py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-300">Attendee Name</th>
          <th class="px-4 py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-300">Email</th>
          <th class="px-4 py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-300">Ticket Type</th>
          <th class="px-4 py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-300">Status</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200 dark:divide-gray-700 text-gray-800 dark:text-gray-200">
        <tr v-for="ticket in tickets" :key="ticket.id">
          <td class="px-4 py-2">{{ ticket.attendee_name }}</td>
          <td class="px-4 py-2">{{ ticket.attendee_email }}</td>
          <td class="px-4 py-2">{{ ticket.ticket_type }}</td>
          <td class="px-4 py-2">
            <span :class="ticket.status === 'used' ? 'text-red-500 dark:text-red-400' : 'text-green-500 dark:text-green-400'">{{ ticket.status }}</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  props: { tickets: { type: Array, required: true } }
}
</script>
