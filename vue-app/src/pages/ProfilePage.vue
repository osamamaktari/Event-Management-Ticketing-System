<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
    
    <header class="h-20 bg-indigo-600 dark:bg-gray-800 text-white p-4 flex justify-between items-center shadow-md sticky top-0 z-30">
      <div class="max-w-7xl mx-auto w-full flex justify-between items-center">
        <router-link to="/" class="flex items-center gap-2 hover:opacity-90 transition-opacity">
          <TicketIcon class="w-8 h-8 text-white" />
          <h1 class="text-2xl font-bold tracking-wider">Eventify</h1>
        </router-link>

        <div class="flex items-center gap-6">
          <router-link to="/" class="text-sm font-medium hover:text-indigo-200 transition-colors">
            Explore Events
          </router-link>
          <router-link to="/my-tickets" class="text-sm font-medium hover:text-indigo-200 transition-colors">
            My Tickets
          </router-link>
          
          <button @click="$emit('toggleDarkMode')" class="p-2 rounded-full hover:bg-white/20 dark:hover:bg-gray-700 focus:outline-none transition-colors">
            <span v-if="isDark">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
            </span>
            <span v-else>
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
            </span>
          </button>
        </div>
      </div>
    </header>

    <main class="max-w-4xl mx-auto p-4 sm:p-6 md:p-8">
      <div class="mb-8 border-b dark:border-gray-800 pb-4">
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white">My Profile</h2>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Update your personal account information and security settings.</p>
      </div>

      <div class="space-y-8">
        <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 class="text-xl font-semibold border-b dark:border-gray-700 pb-3 mb-4 text-gray-900 dark:text-white">Personal Information</h3>
          <form @submit.prevent="updateProfile" class="space-y-4">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
              <input type="text" v-model="profileForm.name" id="name" class="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all">
            </div>
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
              <input type="email" v-model="profileForm.email" id="email" class="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all">
            </div>
            <div>
              <label for="phone" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number (Optional)</label>
              <input type="tel" v-model="profileForm.phone" id="phone" class="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all">
            </div>
            <div class="text-right">
              <button type="submit" class="bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 font-semibold transition-colors shadow-sm">Save Changes</button>
            </div>
          </form>
        </div>

        <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 class="text-xl font-semibold border-b dark:border-gray-700 pb-3 mb-4 text-gray-900 dark:text-white">Change Password</h3>
          <form @submit.prevent="changePassword" class="space-y-4">
            <div>
              <label for="current_password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Current Password</label>
              <input type="password" v-model="passwordForm.current_password" id="current_password" class="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all">
            </div>
            <div>
              <label for="new_password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">New Password</label>
              <input type="password" v-model="passwordForm.new_password" id="new_password" class="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all">
            </div>
            <div>
              <label for="new_password_confirmation" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirm New Password</label>
              <input type="password" v-model="passwordForm.new_password_confirmation" id="new_password_confirmation" class="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all">
            </div>
            <div class="text-right">
              <button type="submit" class="bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 font-semibold transition-colors shadow-sm">Update Password</button>
            </div>
          </form>
        </div>

        <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 class="text-xl font-semibold border-b dark:border-gray-700 pb-3 mb-4 text-gray-900 dark:text-white">Notification Settings</h3>
          <div class="flex items-center justify-between">
            <div>
              <p class="font-medium text-gray-800 dark:text-gray-200">Email Notifications</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">Receive emails about your tickets and event updates.</p>
            </div>
            <button @click="toggleNotifications" :class="notificationSettings.email ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-600'" class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer outline-none">
              <span :class="notificationSettings.email ? 'translate-x-6' : 'translate-x-1'" class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"></span>
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { TicketIcon } from '@heroicons/vue/24/outline';
import { useAuth } from '../composables/useAuth';
import { useNotifications } from '../composables/useNotifications.js';

defineProps({
  isDark: {
    type: Boolean,
    required: true
  }
});
defineEmits(['toggleDarkMode']);

// --- استخراج الدوال الحقيقية من الـ Composable ---
const { user, updateProfileApi, updatePasswordApi } = useAuth();
const { showSuccess, showError, showInfo } = useNotifications();

const profileForm = ref({ name: '', email: '', phone: '' });
// لارافيل يتوقع حقل التاكيد باسم password_confirmation بناءً على كود الباكيند لديك (confirmed)
const passwordForm = ref({ current_password: '', new_password: '', new_password_confirmation: '' });
const notificationSettings = ref({ email: true });

onMounted(() => {
  if (user.value) {
    profileForm.value.name = user.value.name;
    profileForm.value.email = user.value.email;
    profileForm.value.phone = user.value.phone || '';
  }
});

// 🌟 دالة التحديث الحقيقية للبيانات الشخصية
async function updateProfile() {
  try {
    await updateProfileApi({
      name: profileForm.value.name,
      email: profileForm.value.email,
      phone: profileForm.value.phone
    });
    showSuccess('Your personal information has been updated successfully.');
  } catch (err) {
    console.error(err);
    // اقتناص أخطاء الـ Validation من لارافيل وعرضها
    const errorMessage = err.response?.data?.message || 'Failed to update profile.';
    showError(errorMessage);
  }
}

// 🌟 دالة التحديث الحقيقية لكمة المرور
async function changePassword() {
  if (passwordForm.value.new_password !== passwordForm.value.new_password_confirmation) {
    showError('The new password and confirmation do not match.');
    return;
  }
  
  try {
    // نرسل المسميات بالشكل الذي يتوقعه لارافيل بالباكيند: new_password و new_password_confirmation
    await updatePasswordApi({
      current_password: passwordForm.value.current_password,
      new_password: passwordForm.value.new_password,
      new_password_confirmation: passwordForm.value.new_password_confirmation
    });
    
    showSuccess('Your password has been changed successfully.');
    // تصفير الحقول بعد النجاح
    passwordForm.value = { current_password: '', new_password: '', new_password_confirmation: '' };
  } catch (err) {
    console.error(err);
    const errorMessage = err.response?.data?.message || 'Failed to update password.';
    showError(errorMessage);
  }
}

function toggleNotifications() {
  notificationSettings.value.email = !notificationSettings.value.email;
  console.log('Email notifications toggled to:', notificationSettings.value.email);
  showInfo(`Email notifications have been ${notificationSettings.value.email ? 'enabled' : 'disabled'}.`);
}
</script>