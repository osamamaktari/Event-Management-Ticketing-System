<template>
  <!-- Wrapper ensures proper sizing and prevents overflow -->
  <div class="relative h-64 w-full">
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup>
import { Line } from 'vue-chartjs';
import { 
  Chart as ChartJS, 
  Title, 
  Tooltip, 
  Legend, 
  LineElement, 
  PointElement, 
  CategoryScale, 
  LinearScale,
  Filler 
} from 'chart.js';

// Register Chart.js components
ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale, Filler);

// --- Props to accept dynamic data from parent ---
defineProps({
  chartData: {
    type: Object,
    required: true
  }
});

// --- Chart Options ---
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: true }
  },
  scales: {
    y: { beginAtZero: true }
  }
};
</script>
