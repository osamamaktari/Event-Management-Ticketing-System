<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 px-4">
    <div class="w-full max-w-md">
      <!-- Tabs for Login/Register -->
      <div class="flex border-b border-gray-300 dark:border-gray-700 mb-6">
        <button 
          @click="activeTab = 'login'" 
          :class="[
            'w-1/2 py-3 text-center font-semibold transition-colors',
            activeTab === 'login' 
              ? 'border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400' 
              : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
          ]"
        >
          Login
        </button>
        <button 
          @click="activeTab = 'register'" 
          :class="[
            'w-1/2 py-3 text-center font-semibold transition-colors',
            activeTab === 'register' 
              ? 'border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400' 
              : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
          ]"
        >
          Register
        </button>
      </div>

      <div class="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
        <!-- Login Form -->
        <div v-if="activeTab === 'login'">
          <h2 class="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">Welcome Back!</h2>
          <form @submit.prevent="handleLogin" class="space-y-6">
            <div>
              <label for="login-email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
              <input type="email" v-model="loginForm.email" id="login-email" required
                     class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm">
            </div>
            <div>
              <label for="login-password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
              <input type="password" v-model="loginForm.password" id="login-password" required
                     class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm">
            </div>
            <button type="submit" :disabled="isLoading"
                    class="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-indigo-400">
              {{ isLoading ? 'Logging in...' : 'Login' }}
            </button>
          </form>
        </div>

        <!-- Register Form -->
        <div v-if="activeTab === 'register'">
          <h2 class="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">Create Your Account</h2>
          <form @submit.prevent="handleRegister" class="space-y-6">
            <div>
              <label for="register-name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
              <input type="text" v-model="registerForm.name" id="register-name" required
                     class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm">
            </div>
            <div>
              <label for="register-email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
              <input type="email" v-model="registerForm.email" id="register-email" required
                     class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm">
            </div>
            <div>
              <label for="register-password" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
              <input type="password" v-model="registerForm.password" id="register-password" required
                     class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm">
            </div>
            <!-- Role Selection -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">I am an</label>
              <select v-model="registerForm.role"
                      class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm">
                <option value="attendee">Attendee (I want to buy tickets)</option>
                <option value="organizer">Organizer (I want to create events)</option>
              </select>
            </div>
            <button type="submit" :disabled="isLoading"
                    class="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-indigo-400">
              {{ isLoading ? 'Creating Account...' : 'Register' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';
import { useNotifications } from '../composables/useNotifications'; // composable for notifications

const router = useRouter();
const { login, register } = useAuth();
const { showSuccess, showError } = useNotifications(); // success & error notification helpers

// --- Component State ---
const activeTab = ref('login'); // active tab (login/register)
const isLoading = ref(false);

// --- Form Data ---
const loginForm = ref({
  email: '',
  password: ''
});

const registerForm = ref({
  name: '',
  email: '',
  password: '',
  role: 'attendee' // default role
});

// --- Form Submission Handlers ---
async function handleLogin() {
  isLoading.value = true;
  try {
    await login(loginForm.value.email, loginForm.value.password);
    showSuccess('Login successful! Welcome back ');
    router.push('/'); // redirect after login
  } catch (err) {
    showError(err.response?.data?.message || 'Login failed. Please check your credentials.');
  } finally {
    isLoading.value = false;
  }
}

async function handleRegister() {
  isLoading.value = true;
  try {
    await register(registerForm.value);
    showSuccess('Account created successfully ');
    router.push('/'); // redirect after registration
  } catch (err) {
    showError(err.response?.data?.message || 'Registration failed. Please try again.');
  } finally {
    isLoading.value = false;
  }
}
</script>
