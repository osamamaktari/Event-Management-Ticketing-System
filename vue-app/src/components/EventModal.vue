<template>
  <transition name="fade">
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div class="bg-white rounded-xl max-w-lg w-full p-6 relative">
        <!-- Close button -->
        <button @click="close" class="absolute top-3 right-3 text-gray-500 hover:text-gray-800">
          ✕
        </button>

        <!-- Event Details -->
        <h2 class="text-2xl font-bold mb-2">{{ event.title }}</h2>
        <p class="text-gray-600 mb-4">{{ event.description }}</p>
        <p class="mb-2"><strong>Venue:</strong> {{ event.venue }}</p>
        <p class="mb-2">
          <strong>Date:</strong> 
          {{ formatDate(event.start_date) }} 
          <span v-if="event.end_date">- {{ formatDate(event.end_date) }}</span>
        </p>

        <!-- Tickets -->
        <div v-if="tickets.length">
          <h3 class="text-lg font-semibold mt-4 mb-2">Tickets</h3>
          <ul class="space-y-2">
            <li v-for="ticket in tickets" :key="ticket.id" class="flex justify-between items-center border p-2 rounded">
              <span>{{ ticket.name }} - ${{ ticket.price }}</span>
              <button @click="buyTicket(ticket)" class="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
                Buy
              </button>
            </li>
          </ul>
        </div>
        <p v-else class="text-gray-500 mt-4">No tickets available.</p>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    isOpen: { type: Boolean, default: false },
    event: { type: Object, required: true }
  },
  emits: ['close', 'buy-ticket'],
  computed: {
    tickets() {
      // Use event.ticketTypes (from your events array) for modal
      return this.event.ticketTypes || [];
    }
  },
  methods: {
    close() { this.$emit('close'); },
    buyTicket(ticket) { this.$emit('buy-ticket', ticket); },
    formatDate(dateStr) { return new Date(dateStr).toLocaleString(); }
  }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
