<template>
  <transition name="fade">
    <div v-if="isOpen" class="fixed inset-0 z-40 flex items-center justify-center bg-black/70" @click.self="close">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg max-w-2xl w-full m-4 max-h-[90vh] flex flex-col">
        <!-- Header -->
        <div class="p-5 border-b dark:border-gray-700">
          <h3 class="text-xl font-bold text-gray-900 dark:text-white">{{ isEditing ? 'Edit Event' : 'Create New Event' }}</h3>
        </div>

        <!-- Form Body (Scrollable) -->
        <div class="p-6 space-y-4 overflow-y-auto">
          <div>
            <label for="title" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
            <input type="text" v-model="form.title" id="title" class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
          </div>
          <div>
            <label for="description" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
            <textarea v-model="form.description" id="description" rows="3" class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"></textarea>
          </div>
          <div>
            <label for="venue" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Venue</label>
            <input type="text" v-model="form.venue" id="venue" class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm">
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label for="start_date" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Start Date & Time</label>
              <input type="datetime-local" v-model="form.start_date" id="start_date" class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm">
            </div>
            <div>
              <label for="end_date" class="block text-sm font-medium text-gray-700 dark:text-gray-300">End Date & Time (Optional)</label>
              <input type="datetime-local" v-model="form.end_date" id="end_date" class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm">
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Event Banner</label>
            <input type="file" @change="onFileChange" accept="image/*" class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100">
            <img v-if="previewUrl" :src="previewUrl" class="mt-4 rounded-lg max-h-40">
          </div>
        </div>

        <!-- Footer -->
        <div class="p-5 border-t dark:border-gray-700 flex justify-end gap-3">
          <button @click="close" class="px-4 py-2 rounded-md text-sm font-medium bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500">Cancel</button>
          <button @click="submitForm" class="px-4 py-2 rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">Save Event</button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, watch, computed } from 'vue';

const props = defineProps({
  isOpen: Boolean,
  event: { type: Object, default: null }
});

const emit = defineEmits(['close', 'save']);

const form = ref({});
const bannerFile = ref(null);
const previewUrl = ref(null);


const isEditing = computed(() => !!props.event?.id);

// Watch for the event prop to populate the form for editing
watch(() => props.event, (newEvent) => {
  if (newEvent) {
    form.value = {
      title: newEvent.title || '',
      description: newEvent.description || '',
      venue: newEvent.venue || '',
      // Format dates for datetime-local input
      start_date: newEvent.start_date ? newEvent.start_date.slice(0, 16) : '',
      end_date: newEvent.end_date ? newEvent.end_date.slice(0, 16) : '',
    };
    previewUrl.value = newEvent.banner_url;
  } else {
    // Reset form for creation
    form.value = {};
    previewUrl.value = null;
  }
  bannerFile.value = null;
}, { immediate: true });

function onFileChange(e) {
  const file = e.target.files[0];
  if (file) {
    bannerFile.value = file;
    previewUrl.value = URL.createObjectURL(file);
  }
}

function submitForm() {
  // Use FormData to handle file uploads
  const formData = new FormData();
  Object.keys(form.value).forEach(key => {
    if (form.value[key]) {
      formData.append(key, form.value[key]);
    }
  });
  if (bannerFile.value) {
    formData.append('banner', bannerFile.value);
  }
  // For PUT requests, Laravel needs this to correctly handle FormData
  if (isEditing.value) {
    formData.append('_method', 'POST');
  }
  
  emit('save', formData);
}

function close() {
  emit('close');
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
