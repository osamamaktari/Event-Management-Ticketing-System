<template>
  <div class="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
    <div class="flex items-center gap-4">
      <img :src="ticket.qr_code_url" alt="QR Code" class="w-24 h-24 bg-white p-1 rounded"/>
      <div class="text-gray-800 dark:text-gray-200">
        <p><strong>{{ ticket.event_title }}</strong></p>
        <p class="text-gray-600 dark:text-gray-400">Type: {{ ticket.ticket_type }}</p>
        <p class="text-gray-600 dark:text-gray-400">Status: <span :class="ticket.status === 'used' ? 'text-red-500 dark:text-red-400' : 'text-green-500 dark:text-green-400'">{{ ticket.status }}</span></p>
      </div>
    </div>
    <button @click="downloadPDF" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600">
      Download PDF
    </button>
  </div>
</template>

<script>
export default {
  props: { ticket: { type: Object, required: true } },
  methods: {
    downloadPDF() {
      window.open(this.ticket.pdf_url, '_blank');
    }
  }
}
</script>
