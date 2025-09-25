<template>
  <!-- 
    This wrapper div is the key to solving the sizing issue.
    'position: relative' and height/width classes create a bounded box 
    that the chart canvas can fill.
  -->
  <div class="relative h-full w-full">
    <Bar 
      :data="chartData" 
      :options="chartOptions" 
    />
  </div>
</template>

<script setup>
// Import the Bar component from vue-chartjs and necessary parts from chart.js
import { Bar } from 'vue-chartjs';
import { 
  Chart as ChartJS, 
  Title, 
  Tooltip, 
  Legend, 
  BarElement, 
  CategoryScale, 
  LinearScale 
} from 'chart.js';

// Register the components you need for the chart to work
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

// Define the props that this component accepts from its parent (DashboardPage.vue)
defineProps({
  chartData: {
    type: Object,
    required: true
  }
});


// Define the chart's configuration options
const chartOptions = {
  // This makes the chart fill its container.
  responsive: true,
  
  // This is the most important option to fix the sizing and performance issue.
  // It tells Chart.js to ignore its default aspect ratio and stretch to fill the container.
  maintainAspectRatio: false, 
  
  plugins: {
    legend: {
      // We hide the legend for a cleaner look, as the chart title is usually enough.
      display: false,
    }
  },
  scales: {
    y: {
      // Ensure the Y-axis starts at 0.
      beginAtZero: true
    }
  }
};
</script>
