<template>
  <div class="p-4 sm:p-6 md:p-8 max-w-4xl mx-auto">
    <h2 class="text-3xl font-bold mb-8 text-gray-900 dark:text-white">My Profile</h2>

    <div class="space-y-8">
      <!-- 1. Personal Information Card -->
      <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
        <h3 class="text-xl font-semibold border-b dark:border-gray-700 pb-3 mb-4 text-gray-900 dark:text-white">Personal Information</h3>
        <form @submit.prevent="updateProfile" class="space-y-4">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
            <input type="text" v-model="profileForm.name" id="name" class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm">
          </div>
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
            <input type="email" v-model="profileForm.email" id="email" class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm">
          </div>
          <div>
            <label for="phone" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number (Optional)</label>
            <input type="tel" v-model="profileForm.phone" id="phone" class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm">
          </div>
          <div class="text-right">
            <button type="submit" class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 font-semibold">Save Changes</button>
          </div>
        </form>
      </div>

      <!-- 2. Change Password Card -->
      <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
        <h3 class="text-xl font-semibold border-b dark:border-gray-700 pb-3 mb-4 text-gray-900 dark:text-white">Change Password</h3>
        <form @submit.prevent="changePassword" class="space-y-4">
          <div>
            <label for="current_password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Current Password</label>
            <input type="password" v-model="passwordForm.current_password" id="current_password" class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm">
          </div>
          <div>
            <label for="new_password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">New Password</label>
            <input type="password" v-model="passwordForm.new_password" id="new_password" class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm">
          </div>
          <div>
            <label for="new_password_confirmation" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirm New Password</label>
            <input type="password" v-model="passwordForm.new_password_confirmation" id="new_password_confirmation" class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm">
          </div>
          <div class="text-right">
            <button type="submit" class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 font-semibold">Update Password</button>
          </div>
        </form>
      </div>

      <!-- 3. Notification Settings Card -->
      <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
        <h3 class="text-xl font-semibold border-b dark:border-gray-700 pb-3 mb-4 text-gray-900 dark:text-white">Notification Settings</h3>
        <div class="flex items-center justify-between">
          <div>
            <p class="font-medium text-gray-800 dark:text-gray-200">Email Notifications</p>
            <p class="text-sm text-gray-500 dark:text-gray-400">Receive emails about your tickets and event updates.</p>
          </div>
          <button @click="toggleNotifications" :class="notificationSettings.email ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-600'" class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors">
            <span :class="notificationSettings.email ? 'translate-x-6' : 'translate-x-1'" class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"></span>
          </button>
        </div>
      </div>
    </div>

    <!-- The Notification Modal has been removed from here -->
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
// 1. Import the necessary composables
import { useAuth } from '../composables/useAuth';
import { useNotifications } from '../composables/useNotifications.js';

// 2. Initialize the composables
const { user } = useAuth();
const { showSuccess, showError, showInfo } = useNotifications();

// --- Component State ---
const profileForm = ref({ name: '', email: '', phone: '' });
const passwordForm = ref({ current_password: '', new_password: '', new_password_confirmation: '' });
const notificationSettings = ref({ email: true });

// 3. Remove the state variables for the old notification modal
// const isNotifyOpen = ref(false);
// const notifyType = ref('success');
// const notifyTitle = ref('');
// const notifyMessage = ref('');

// --- Populate form with user data when component is mounted ---
onMounted(() => {
  if (user.value) {
    profileForm.value.name = user.value.name;
    profileForm.value.email = user.value.email;
    profileForm.value.phone = user.value.phone || '';
  }
});

// --- Form Submission Handlers (Simulated) ---
async function updateProfile() {
  console.log('Updating profile with:', profileForm.value);
  
  // 4. Use the toast notification
  showSuccess('(Simulation) Your personal information has been updated successfully.');
}

async function changePassword() {
  if (passwordForm.value.new_password !== passwordForm.value.new_password_confirmation) {
    // 5. Use the error toast for validation errors
    showError('The new password and confirmation do not match.');
    return;
  }
  console.log('Changing password...');

  // 6. Use the success toast
  showSuccess('(Simulation) Your password has been changed successfully.');
  
  passwordForm.value = { current_password: '', new_password: '', new_password_confirmation: '' };
}

function toggleNotifications() {
  notificationSettings.value.email = !notificationSettings.value.email;
  console.log('Email notifications toggled to:', notificationSettings.value.email);

  // 7. Use the info toast for settings changes
  showInfo(`Email notifications have been ${notificationSettings.value.email ? 'enabled' : 'disabled'}.`);
}
</script>
