<template>

  <div class="flex min-h-screen bg-gray-100 dark:bg-gray-900">

    <AppSidebar :show="sidebarOpen" @close="sidebarOpen=false" />

    <div class="flex-1 flex flex-col">
  
      <AppHeader 

        :is-dark="isDark"
        @toggleSidebar="sidebarOpen = !sidebarOpen"
        @toggle-dark-mode="toggleDark" 
          @search="handleSearch"
      />

      <!-- Main content -->
      <main class="flex-1 p-4 md:ml-0">
        <router-view :search-query="searchQuery" />
      </main>

      <!-- Footer -->
      <AppFooter />
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useDark, useToggle } from '@vueuse/core';

import AppHeader from './components/AppHeader.vue';
import AppSidebar from './components/AppSidebar.vue';
import AppFooter from './components/AppFooter.vue';

const searchQuery = ref('');
const sidebarOpen = ref(false);
const route = useRoute();
const pageTitle = ref(route.meta.title || 'Event Management');

function handleSearch(query) {
  searchQuery.value = query;
}

const isDark = useDark();
const toggleDark = useToggle(isDark);

watch(route, (newRoute) => {
  pageTitle.value = newRoute.meta.title || 'Event Management';
});
</script>
