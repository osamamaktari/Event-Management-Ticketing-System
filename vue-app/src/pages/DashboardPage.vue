<template>
  <div class="p-4 sm:p-6 md:p-8">
    <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-8">Dashboard</h2>

    <!-- Loading State -->
    <div v-if="isLoading" class="text-center text-gray-500 py-10">
      Loading dashboard data...
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center text-red-500 bg-red-100 p-4 rounded-lg">
      {{ error }}
    </div>

    <!-- Dashboard Content -->
    <div v-else>
      <!-- Key Metrics Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
          <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Revenue</p>
          <p class="mt-1 text-3xl font-bold text-gray-900 dark:text-white">
            ${{ (analytics.totalRevenue ?? 0).toLocaleString() }}
          </p>
        </div>
        <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
          <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Tickets Sold</p>
          <p class="mt-1 text-3xl font-bold text-gray-900 dark:text-white">
            {{ (analytics.totalTicketsSold ?? 0).toLocaleString() }}
          </p>
        </div>
        <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
          <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Events</p>
          <p class="mt-1 text-3xl font-bold text-gray-900 dark:text-white">
            {{ analytics.totalEvents ?? 0 }}
          </p>
        </div>
        <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
          <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Attendees</p>
          <p class="mt-1 text-3xl font-bold text-gray-900 dark:text-white">
            {{ analytics.totalAttendees ?? 0 }}
          </p>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
        <div class="lg:col-span-3 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md h-96">
          <h3 class="font-semibold text-gray-900 dark:text-white mb-4">Tickets Sold Per Event</h3>
          <BarChart v-if="analytics.ticketsSoldPerEvent?.length" :chart-data="ticketsSoldChartData" />
          <p v-else class="text-gray-500 text-sm">No data available</p>
        </div>
        <div class="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md h-96">
          <h3 class="font-semibold text-gray-900 dark:text-white mb-4">Revenue Over Time</h3>
          <LineChart v-if="analytics.revenueByMonth?.length" :chart-data="revenueChartData" />
          <p v-else class="text-gray-500 text-sm">No data available</p>
        </div>
      </div>

      <!-- Lists Section (Top Events & Recent Orders) -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
          <h3 class="font-semibold text-gray-900 dark:text-white mb-4">Top Performing Events</h3>
          <ul class="space-y-4">
            <li
              v-for="event in analytics.topEvents || []"
              :key="event.id"
              class="flex items-center justify-between"
            >
              <span class="font-medium text-gray-800 dark:text-gray-200">{{ event.title }}</span>
              <span class="font-bold text-indigo-600 dark:text-indigo-400">
                ${{ (event.revenue ?? 0).toLocaleString() }}
              </span>
            </li>
            <li v-if="!analytics.topEvents?.length" class="text-sm text-gray-500">No events data</li>
          </ul>
        </div>
        <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
          <h3 class="font-semibold text-gray-900 dark:text-white mb-4">Recent Orders</h3>
          <ul class="space-y-4">
            <li
              v-for="order in analytics.recentOrders || []"
              :key="order.id"
              class="flex items-center justify-between"
            >
              <div>
                <p class="font-medium text-gray-800 dark:text-gray-200">{{ order.attendeeName }}</p>
                <p class="text-sm text-gray-500 dark:text-gray-400">{{ order.eventName }}</p>
              </div>
              <span class="text-sm text-gray-700 dark:text-gray-300">
                ${{ (order.totalAmount ?? 0).toLocaleString() }}
              </span>
            </li>
            <li v-if="!analytics.recentOrders?.length" class="text-sm text-gray-500">No recent orders</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import BarChart from '../components/charts/BarChart.vue';
import LineChart from '../components/charts/LineChart.vue';
import api from '../services/api';

const analytics = ref({
  totalRevenue: 0,
  totalTicketsSold: 0,
  totalEvents: 0,
  totalAttendees: 0,
  ticketsSoldPerEvent: [],
  revenueByMonth: [],
  topEvents: [],
  recentOrders: [],
});

const isLoading = ref(true);
const error = ref(null);

const ticketsSoldChartData = computed(() => ({
  labels: analytics.value.ticketsSoldPerEvent?.map(e => e.title) || [],
  datasets: [{
    label: 'Tickets Sold',
    backgroundColor: '#4F46E5',
    data: analytics.value.ticketsSoldPerEvent?.map(e => e.ticketsSold) || [],
  }],
}));

const revenueChartData = computed(() => ({
  labels: analytics.value.revenueByMonth?.map(m => m.month) || [],
  datasets: [{
    label: 'Revenue',
    borderColor: '#10B981',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,  
      pointRadius: 4,
    fill: true,
    data: analytics.value.revenueByMonth?.map(m => m.revenue) || [],
  }],
}));

async function fetchDashboardData() {
  isLoading.value = true;
  error.value = null;

  try {
    const res = await api.get('/admin/dashboard');
    analytics.value = { ...analytics.value, ...res.data }; // دمج البيانات مع الافتراضية
  } catch (err) {
    console.error(err);
    error.value = err.response?.data?.message || 'Failed to load dashboard data.';
  } finally {
    isLoading.value = false;
  }
}

onMounted(fetchDashboardData);
</script>
