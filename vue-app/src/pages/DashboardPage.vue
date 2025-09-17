<template>
  <div class="p-4 sm:p-6 md:p-8">
    <h2 class="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Dashboard</h2>

    <!-- Loading and Error States -->
    <div v-if="isLoading" class="text-center text-gray-500 py-10">Loading dashboard data...</div>
    <div v-else-if="error" class="text-center text-red-500 bg-red-100 p-4 rounded-lg">{{ error }}</div>

    <!-- Dashboard Content -->
    <div v-else>
      <!-- 1. Key Metrics Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
          <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Revenue</p>
          <p class="mt-1 text-3xl font-bold text-gray-900 dark:text-white">${{ analytics.totalRevenue.toLocaleString() }}</p>
        </div>
        <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
          <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Tickets Sold</p>
          <p class="mt-1 text-3xl font-bold text-gray-900 dark:text-white">{{ analytics.totalTicketsSold.toLocaleString() }}</p>
        </div>
        <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
          <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Events</p>
          <p class="mt-1 text-3xl font-bold text-gray-900 dark:text-white">{{ analytics.totalEvents }}</p>
        </div>
        <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
          <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Attendees</p>
          <p class="mt-1 text-3xl font-bold text-gray-900 dark:text-white">{{ analytics.totalAttendees }}</p>
        </div>
      </div>

      <!-- 2. Charts Section -->
      <div class="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
        <!-- Bar Chart -->
        <div class="lg:col-span-3 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
          <h3 class="font-semibold text-gray-900 dark:text-white mb-4">Tickets Sold Per Event</h3>
          <BarChart v-if="!isLoading" :chart-data="ticketsSoldChartData" />
        </div>
        <!-- Line Chart -->
        <div class="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
          <h3 class="font-semibold text-gray-900 dark:text-white mb-4">Revenue Over Time</h3>
          <LineChart v-if="!isLoading" :chart-data="revenueChartData" />
        </div>
      </div>

      <!-- 3. Lists Section (Top Events & Recent Orders) -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Top Performing Events -->
        <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
          <h3 class="font-semibold text-gray-900 dark:text-white mb-4">Top Performing Events</h3>
          <ul class="space-y-4">
            <li v-for="event in analytics.topEvents" :key="event.id" class="flex items-center justify-between">
              <span class="font-medium text-gray-800 dark:text-gray-200">{{ event.title }}</span>
              <span class="font-bold text-indigo-600 dark:text-indigo-400">${{ event.revenue.toLocaleString() }}</span>
            </li>
          </ul>
        </div>
        <!-- Recent Orders -->
        <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
          <h3 class="font-semibold text-gray-900 dark:text-white mb-4">Recent Orders</h3>
          <ul class="space-y-4">
            <li v-for="order in analytics.recentOrders" :key="order.id" class="flex items-center justify-between">
              <div>
                <p class="font-medium text-gray-800 dark:text-gray-200">{{ order.attendeeName }}</p>
                <p class="text-sm text-gray-500 dark:text-gray-400">{{ order.eventName }}</p>
              </div>
              <span class="text-sm text-gray-700 dark:text-gray-300">${{ order.totalAmount.toLocaleString() }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
// Import chart components (we will create these next)
import BarChart from '../components/charts/BarChart.vue';
import LineChart from '../components/charts/LineChart.vue';
// Import auth composable to check user role
// import { useAuth } from '../composables/useAuth';

/*
// --- UNCOMMENT THIS SECTION WHEN API IS READY ---
import { getAdminAnalytics, getOrganizerAnalytics } from '../services/analyticsService';
*/

// --- Mock Data for Frontend Development ---
const mockAnalyticsData = {
  totalRevenue: 75950,
  totalTicketsSold: 850,
  totalEvents: 12,
  totalAttendees: 620,
  ticketsSoldPerEvent: [
    { eventId: 1, title: 'Concert', ticketsSold: 350 },
    { eventId: 2, title: 'Tech Conf', ticketsSold: 220 },
    { eventId: 3, title: 'Art Expo', ticketsSold: 150 },
    { eventId: 4, title: 'Food Fest', ticketsSold: 80 },
    { eventId: 5, title: 'Book Fair', ticketsSold: 50 },
  ],
  revenueByMonth: [
    { month: 'Jan', revenue: 10500 }, { month: 'Feb', revenue: 15200 },
    { month: 'Mar', revenue: 12300 }, { month: 'Apr', revenue: 18400 },
    { month: 'May', revenue: 19550 },
  ],
  topEvents: [
    { id: 1, title: 'Concert', revenue: 32500 },
    { id: 2, title: 'Tech Conf', revenue: 28000 },
    { id: 3, title: 'Art Expo', revenue: 9500 },
  ],
  recentOrders: [
    { id: 101, attendeeName: 'Alice Johnson', eventName: 'Concert', totalAmount: 200 },
    { id: 102, attendeeName: 'Bob Williams', eventName: 'Tech Conf', totalAmount: 300 },
    { id: 103, attendeeName: 'Charlie Brown', eventName: 'Concert', totalAmount: 50 },
  ]
};

// --- Component State ---
const analytics = ref({});
const isLoading = ref(true);
const error = ref(null);
// const { isAdmin } = useAuth(); // To determine which API to call

// --- Chart Data ---
// Computed properties to format data for the chart components
const ticketsSoldChartData = computed(() => ({
  labels: analytics.value.ticketsSoldPerEvent?.map(e => e.title) || [],
  datasets: [{
    label: 'Tickets Sold',
    backgroundColor: '#4F46E5', // Indigo
    data: analytics.value.ticketsSoldPerEvent?.map(e => e.ticketsSold) || [],
  }]
}));

const revenueChartData = computed(() => ({
  labels: analytics.value.revenueByMonth?.map(m => m.month) || [],
  datasets: [{
    label: 'Revenue',
    borderColor: '#10B981', // Emerald
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    tension: 0.3,
    fill: true,
    data: analytics.value.revenueByMonth?.map(m => m.revenue) || [],
  }]
}));

// --- Data Fetching ---
onMounted(async () => {
  await fetchMockData();
  // await fetchApiData(); // UNCOMMENT FOR REAL API
});

// --- MOCK FUNCTION (for frontend only) ---
async function fetchMockData() {
  isLoading.value = true;
  await new Promise(resolve => setTimeout(resolve, 1000));
  analytics.value = mockAnalyticsData;
  isLoading.value = false;
}

/*
// --- REAL API FUNCTION (use when backend is ready) ---
async function fetchApiData() {
  isLoading.value = true;
  error.value = null;
  try {
    // Check user role and call the appropriate service
    const response = isAdmin.value 
      ? await getAdminAnalytics() 
      : await getOrganizerAnalytics();
    analytics.value = response.data;
  } catch (err) {
    error.value = 'Failed to load analytics data.';
    console.error(err);
  } finally {
    isLoading.value = false;
  }
}
*/
</script>
