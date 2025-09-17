<template>
  <transition name="fade">
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60" @click.self="handleCancel">
      <transition name="pop">
        <div v-if="isOpen" class="bg-white dark:bg-gray-800 rounded-xl shadow-lg max-w-sm w-full m-4">
          <div class="p-6 text-center">
            <!-- Icon -->
            <div v-if="type" class="mx-auto mb-4 w-12 h-12 rounded-full flex items-center justify-center" :class="iconBgClass">
              <!-- Success Icon -->
              <svg v-if="type === 'success'" class="w-8 h-8" :class="iconColorClass" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
              <!-- Error Icon -->
              <svg v-if="type === 'error'" class="w-8 h-8" :class="iconColorClass" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              <!-- Warning/Confirm Icon -->
              <svg v-if="type === 'confirm'" class="w-8 h-8" :class="iconColorClass" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
            </div>

            <!-- Text Content -->
            <h3 class="text-xl font-bold text-gray-900 dark:text-white">{{ title }}</h3>
            <p class="mt-2 text-sm text-gray-600 dark:text-gray-300">{{ message }}</p>
          </div>

          <!-- Buttons -->
          <div class="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 rounded-b-xl flex gap-3" :class="buttons.length === 1 ? 'justify-center' : 'justify-end'">
            <button
              v-for="button in buttons"
              :key="button.text"
              @click="button.action"
              :class="button.style"
              class="px-4 py-2 rounded-md font-semibold text-sm"
            >
              {{ button.text }}
            </button>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  isOpen: Boolean,
  type: { type: String, default: 'confirm' }, // 'success', 'error', 'confirm'
  title: String,
  message: String,
  confirmText: { type: String, default: 'Confirm' },
  cancelText: { type: String, default: 'Cancel' },
  showCancel: { type: Boolean, default: true },
} );

const emit = defineEmits(['confirm', 'cancel']);

const handleConfirm = () => emit('confirm');
const handleCancel = () => emit('cancel');

// --- Dynamic Styles ---
const iconBgClass = computed(() => ({
  'success': 'bg-green-100 dark:bg-green-900/50',
  'error': 'bg-red-100 dark:bg-red-900/50',
  'confirm': 'bg-yellow-100 dark:bg-yellow-900/50',
}[props.type]));

const iconColorClass = computed(() => ({
  'success': 'text-green-600 dark:text-green-400',
  'error': 'text-red-600 dark:text-red-400',
  'confirm': 'text-yellow-600 dark:text-yellow-400',
}[props.type]));

const confirmButtonStyle = computed(() => ({
  'success': 'bg-green-600 hover:bg-green-700 text-white',
  'error': 'bg-red-600 hover:bg-red-700 text-white',
  'confirm': 'bg-indigo-600 hover:bg-indigo-700 text-white',
}[props.type] || 'bg-indigo-600 hover:bg-indigo-700 text-white'));

// --- Dynamic Buttons ---
const buttons = computed(() => {
  const btns = [];
  if (props.showCancel) {
    btns.push({ text: props.cancelText, action: handleCancel, style: 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-200' });
  }
  btns.push({ text: props.confirmText, action: handleConfirm, style: confirmButtonStyle.value });
  return props.showCancel ? btns.reverse() : btns; // Show confirm button on the right
});
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.pop-enter-active { transition: all 0.3s ease; }
.pop-leave-active { transition: all 0.2s ease; }
.pop-enter-from, .pop-leave-to { transform: scale(0.9); opacity: 0; }
</style>
