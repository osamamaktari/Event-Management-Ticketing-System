<template>
  <transition name="fade">
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/70" @click.self="$emit('close')">
      <transition name="pop">
        <div v-if="isOpen" class="bg-white dark:bg-gray-800 rounded-xl shadow-lg max-w-xs w-full m-4 text-center">
          
          <div class="p-6">
            <h3 class="text-lg font-bold text-gray-900 dark:text-white">Scan Ticket QR Code</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-4">{{ ticketInfo }}</p>
            
            <!-- The QR code is rendered here inside a white container for better scanning -->
            <div class="bg-white p-4 inline-block rounded-lg border dark:border-gray-700">
              <qrcode-vue 
                :value="qrCodeValue" 
                :size="220" 
                level="H" 
                render-as="svg" 
              />
            </div>
          </div>

          <!-- Footer with Close Button -->
          <div class="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 rounded-b-xl">
            <button @click="$emit('close')" class="w-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-md font-semibold text-sm">
              Close
            </button>
          </div>

        </div>
      </transition>
    </div>
  </transition>
</template>

<script setup>
// 1. Import the installed library
import QrcodeVue from 'qrcode.vue';

// 2. Define the component's props and emits
defineProps({
  isOpen: { type: Boolean, default: false },
  qrCodeValue: { type: String, required: true }, // The string to be converted to a QR code
  ticketInfo: { type: String, default: '' },    // Optional info like "Event Name - VIP"
});

defineEmits(['close']);
</script>

<style scoped>
/* Simple fade transition for the modal background */
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* Pop-in transition for the modal content */
.pop-enter-active { transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1); }
.pop-leave-active { transition: all 0.2s ease-in-out; }
.pop-enter-from, .pop-leave-to { transform: scale(0.95); opacity: 0; }
</style>
