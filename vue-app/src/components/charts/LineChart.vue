<template>
  <!-- 
    This wrapper div is crucial. It establishes a rendering context 
    for the chart canvas, preventing it from overflowing and causing performance drops.
  -->
  <div class="relative h-full w-full">
    <Line 
      :data="chartData" 
      :options="chartOptions" 
    />
  </div>
</template>

<script setup>
// Import the Line component from vue-chartjs and necessary parts from chart.js
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
  Filler // Import Filler for area-under-the-line fills
} from 'chart.js';

// Register the components for the line chart
ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale, Filler);

// Define the props that this component accepts
defineProps({
  chartData: {
    type: Object,
    required: true
  }
});

// Define the chart's configuration options
const chartOptions = {
  // Makes the chart responsive to its container's size.
  responsive: true,

  // This is the critical fix. It allows the chart to adopt the container's
  // aspect ratio instead of its own, solving the infinite height problem.
  maintainAspectRatio: false,

  plugins: {
    legend: {
      // The legend is often redundant, so we hide it.
      display: false,
    }
  },
  scales: {
    y: {
      // Ensure the Y-axis starts at 0 for accurate representation.
      beginAtZero: true
    }
  }
};
</script>
