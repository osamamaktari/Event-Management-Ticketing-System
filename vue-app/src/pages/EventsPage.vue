<template>
  <div>
    <h2 class="text-2xl font-bold mb-4 text-gray-900 dark:text-white">All Events</h2>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <EventCard 
        v-for="event in events" 
        :key="event.id" 
        :event="event" 
        @click="openModal(event)" 
      />
    </div>

    <EventModal 
      :isOpen="isModalOpen" 
      :event="selectedEvent" 
      @close="closeModal" 
      @buy-ticket="handleBuyTicket"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import EventCard from '../components/EventCard.vue';
import EventModal from '../components/EventModal.vue';

const events = ref([
  { 
    id: 1, 
    title: 'Music Concert', 
    description: 'Live music night', 
    venue: 'Hall A', 
    start_date: '2025-10-01', 
    end_date: '2025-10-01',
    ticketTypes:[
      {id:1,name:'VIP',price:100,quantity:50},
      {id:2,name:'Standard',price:50,quantity:100}
    ] 
  },
  { 
    id: 2, 
    title: 'Tech Conference', 
    description: 'Learn Vue 3 & Laravel', 
    venue: 'Hall B', 
    start_date: '2025-11-05', 
    end_date: '2025-11-06',
    ticketTypes:[
      {id:3,name:'Standard',price:30,quantity:200}
    ] 
  },
]);

const selectedEvent = ref(null);
const isModalOpen = ref(false);

function openModal(event) {
  selectedEvent.value = event;
  isModalOpen.value = true;
}

function closeModal() {
  selectedEvent.value = null;
  isModalOpen.value = false;
}

function handleBuyTicket(ticket) {
  alert(`Buying ${ticket.name} ticket for $${ticket.price}`);
}
</script>
