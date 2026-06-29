<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-500 font-sans antialiased">
    
    <header class="main-header sticky top-0 z-40 w-full border-b border-gray-200/80 dark:border-gray-800 bg-white/70 dark:bg-gray-900/80 backdrop-blur-md transition-all duration-300">
      <div class="max-w-7xl mx-auto h-20 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        
        <router-link to="/" class="group flex items-center gap-3 focus:outline-none">
          <div class="p-2 bg-indigo-600 dark:bg-indigo-500 rounded-xl shadow-md shadow-indigo-500/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
            <TicketIcon class="w-6 h-6 text-white" />
          </div>
          <span class="text-2xl font-black tracking-tight bg-gradient-to-r from-indigo-600 to-violet-500 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">
            Eventify
          </span>
        </router-link>

        <div class="flex items-center gap-4 sm:gap-6">
          
          <template v-if="isLogged()">
            <div class="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full border border-gray-200/50 dark:border-gray-700/50">
              <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span class="text-xs font-semibold text-gray-600 dark:text-gray-300">
                Hi, {{ user?.name }}
              </span>
            </div>

            <nav class="flex items-center gap-1 sm:gap-2">
              <router-link
                to="/my-tickets"
                class="relative px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200 after:absolute after:bottom-0 after:left-1/2 after:w-0 after:h-0.5 after:bg-indigo-600 dark:after:bg-indigo-400 after:transition-all hover:after:w-1/2 hover:after:left-1/4"
              >
                My Tickets
              </router-link>

              <router-link
                to="/profile"
                class="relative px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200 after:absolute after:bottom-0 after:left-1/2 after:w-0 after:h-0.5 after:bg-indigo-600 dark:after:bg-indigo-400 after:transition-all hover:after:w-1/2 hover:after:left-1/4"
              >
                Profile
              </router-link>
            </nav>

            <button
              @click="handleLogout"
              class="ml-2 bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/60 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 text-red-600 dark:text-red-400 border border-red-200/30 dark:border-red-900/30 active:scale-95"
            >
              Logout
            </button>
          </template>

          <template v-else>
            <router-link
              to="/auth"
              class="text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-indigo-500 dark:hover:bg-indigo-600 px-5 py-2.5 rounded-xl hover:shadow-lg hover:shadow-indigo-500/20 transition-all duration-300 active:scale-95"
            >
              Login
            </router-link>
          </template>

          <span class="h-6 w-[1px] bg-gray-200 dark:bg-gray-800 hidden sm:block"></span>

          <button 
            @click="$emit('toggleDarkMode')" 
            class="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-transparent hover:border-gray-200 dark:hover:border-gray-700 focus:outline-none transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <span v-if="isDark" class="block transform rotate-0 hover:rotate-12 transition-transform duration-300">
              <svg class="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 100 2h1z" clip-rule="evenodd"></path></svg>
            </span>
            <span v-else class="block transform rotate-0 hover:-rotate-12 transition-transform duration-300">
              <svg class="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path></svg>
            </span>
          </button>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      <div class="hero-section flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6 bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm shadow-gray-100/50 dark:shadow-none">
        <div>
          <h2 class="text-3xl font-black text-gray-900 dark:text-white tracking-tight sm:text-4xl">
            Explore Events
          </h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-2 font-medium">
            Book premium tickets for exclusive experiences instantly.
          </p>
        </div>
        
        <div class="relative w-full md:w-80 group">
          <span class="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
            <svg class="w-5 h-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </span>
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Search events by title..." 
            class="pl-11 pr-4 py-3 w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-2xl focus:bg-white dark:focus:bg-gray-900 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all duration-300 font-medium placeholder-gray-400 text-sm"
          />
        </div>
      </div>

      <div v-if="isLoading" class="flex flex-col items-center justify-center py-32 text-gray-400 dark:text-gray-500">
        <div class="relative flex items-center justify-center">
          <div class="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
          <div class="absolute rounded-full h-6 w-6 border-4 border-violet-400 border-b-transparent animate-spin animate-reverse"></div>
        </div>
        <p class="mt-4 text-sm font-bold tracking-wide bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent">Loading experiences...</p>
      </div>

      <div v-else-if="error" class="text-center text-red-600 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 p-6 rounded-2xl max-w-xl mx-auto backdrop-blur-sm shadow-xl shadow-red-500/5">
        <p class="font-bold text-lg mb-1">System Error</p>
        <p class="text-sm font-medium">{{ error }}</p>
      </div>

      <div v-else-if="filteredEvents.length">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <EventCard 
            v-for="event in filteredEvents" 
            :key="event.id" 
            :event="event" 
            class="event-card-item hover:-translate-y-2 hover:shadow-xl hover:shadow-indigo-500/5 dark:hover:shadow-none transition-all duration-300 cursor-pointer opacity-0"
            @click="openModal(event)" 
          />
        </div>
      </div>
      
      <div v-else class="text-center text-gray-400 dark:text-gray-500 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 py-20 px-6 rounded-3xl max-w-md mx-auto shadow-sm">
        <svg class="w-14 h-14 mx-auto text-gray-300 dark:text-gray-700 mb-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        <h3 class="text-lg font-bold text-gray-800 dark:text-gray-200">No Events Discovered</h3>
        <p class="text-sm mt-1 max-w-xs mx-auto text-gray-500 dark:text-gray-400 font-medium">Try modifying your query or return at a later interval.</p>
      </div>
    </main>

    <EventModal 
      v-if="isModalOpen"
      :isOpen="isModalOpen" 
      :event="selectedEvent" 
      @close="closeModal" 
      @create-order="prepareCreateOrder"
    />

    <ConfirmationModal
      :isOpen="isConfirmModalOpen"
      :type="confirmModalType"
      :title="confirmModalTitle"
      :message="confirmModalMessage"
      :confirmText="confirmModalActionText"
      :showCancel="confirmModalShowCancel"
      @confirm="executeOrder"
      @cancel="cancelOrder"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch, nextTick } from 'vue'; 
import EventCard from '../components/EventCard.vue';
import EventModal from '../components/EventModal.vue';
import ConfirmationModal from '@/components/ConfirmationModal.vue';
import { TicketIcon } from '@heroicons/vue/24/outline';
import { getEvents } from '../services/eventsService';
import { createOrder } from '../services/ordersService';
import { useAuth } from '../composables/useAuth';
import { useNotifications } from '../composables/useNotifications';

// 🌟 استدعاء مكتبة GSAP
import { gsap } from 'gsap';

defineProps({
  isDark: {
    type: Boolean,
    required: true
  }
});

defineEmits(['toggleDarkMode']);

const { isLogged, logout, user } = useAuth();
const { showSuccess, showError } = useNotifications();

const events = ref([]);
const searchQuery = ref('');
const isLoading = ref(true);
const error = ref(null);
const selectedEvent = ref(null);
const isModalOpen = ref(false);

const isConfirmModalOpen = ref(false);
const confirmModalType = ref('confirm'); 
const confirmModalTitle = ref('');
const confirmModalMessage = ref('');
const confirmModalActionText = ref('Confirm');
const confirmModalShowCancel = ref(true);
const pendingOrderPayload = ref(null);

const filteredEvents = computed(() => {
  return events.value.filter(event => {
    const isApproved = event.status === 'approved';
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.value.toLowerCase());
    return isApproved && matchesSearch;
  });
});

// 🌟 دالة مخصصة لتحريك كروت الفعاليات عند ظهورها أو فلترتها باستخدام GSAP
const animateCards = () => {
  nextTick(() => {
    gsap.fromTo(".event-card-item", 
      { opacity: 0, y: 30, scale: 0.95 },
      { 
        opacity: 1, 
        y: 0, 
        scale: 1,
        duration: 0.6, 
        stagger: 0.08, 
        ease: "power3.out",
        overwrite: "auto"
      }
    );
  });
};

// مراقبة أي تغيير في التصفية أو البحث لإعادة الأنيميشن بشكل سلس
watch(filteredEvents, () => {
  if (filteredEvents.value.length > 0) {
    animateCards();
  }
});

async function fetchEvents() {
  isLoading.value = true;
  error.value = null;
  try {
    const res = await getEvents();
    events.value = res.data.data || [];
    // تشغيل الحركة بعد تحميل البيانات بنجاح
    animateCards();
  } catch (err) {
    error.value = 'Failed to load events. Please try again later.';
    console.error(err);
  } finally { // ✅ تم تعديل الكلمة هنا (finally)
    isLoading.value = false;
  }
}

function openModal(event) {
  selectedEvent.value = event;
  isModalOpen.value = true;
}

function closeModal() {
  isModalOpen.value = false;
}

function prepareCreateOrder(orderPayload) {
  if (!isLogged()) {
    showError('Please log in to purchase tickets.');
    return;
  }
  pendingOrderPayload.value = orderPayload;
  const totalItems = orderPayload.items.reduce((sum, item) => sum + item.quantity, 0);
  const plural = totalItems > 1 ? 's' : '';

  confirmModalType.value = 'confirm';
  confirmModalTitle.value = 'Confirm Your Purchase';
  confirmModalMessage.value = `You are about to purchase ${totalItems} ticket${plural} for "${selectedEvent.value.title}". Do you want to proceed?`;
  confirmModalActionText.value = 'Yes, Buy Now';
  confirmModalShowCancel.value = true;
  isConfirmModalOpen.value = true;

  closeModal();
}

async function executeOrder() {
  isConfirmModalOpen.value = false;
  if (!pendingOrderPayload.value) return;

  try {
    await createOrder(selectedEvent.value.id, pendingOrderPayload.value);
    showSuccess('Purchase successful! Your tickets are now confirmed.');
  } catch (err) {
    showError(err.response?.data?.message || 'Failed to create order.');
  } finally { // ✅ تم تعديل الكلمة هنا أيضاً (finally)
    pendingOrderPayload.value = null;
  }
}

function cancelOrder() {
  isConfirmModalOpen.value = false;
  pendingOrderPayload.value = null;
}

async function handleLogout() {
  await logout();
}

onMounted(() => {
  fetchEvents();

  // 🌟 أنيميشن دخول الـ Header والـ Hero عند تشغيل الصفحة أول مرة
  gsap.from(".main-header", {
    y: -80,
    opacity: 0,
    duration: 0.8,
    ease: "power4.out"
  });

  gsap.from(".hero-section", {
    y: 20,
    opacity: 0,
    duration: 0.8,
    delay: 0.2,
    ease: "power3.out"
  });
});
</script>

<style scoped>
.animate-reverse {
  animation-direction: reverse;
}
</style>