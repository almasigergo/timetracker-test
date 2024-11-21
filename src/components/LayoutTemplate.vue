<script setup>
    import { computed, provide } from 'vue'
    import { useRoute, RouterLink } from 'vue-router'
    import DevTools from '@/components/DevTools.vue'

    const route = useRoute()

    const pageTitle = computed(() => route.meta.pageTitle || 'Default Title')

    // Import the shared store
    import useSharedStore from '@/include/useSharedStore'

    // Provide the shared state and actions to child components
    const sharedStore = useSharedStore()
    provide('useSharedStore', sharedStore)
</script>

<template>
    <div class="layout-template bg-slate-100">
    <!-- Header Section -->
    <header class="bg-indigo-600 shadow pb-32">
      <nav class="flex items-center gap-4 p-6">
        <RouterLink to="/">
          <img src="@/assets/logo.svg" alt="Logo" class="logo" />
        </RouterLink>
        <RouterLink to="/" class="px-4 py-2 rounded hover:bg-white/10 text-white text-sm font-medium aria-[current=page]:bg-white/20">Timetracker</RouterLink>
        <RouterLink to="/reports" class="px-4 py-2 rounded hover:bg-white/10 text-white text-sm font-medium aria-[current=page]:bg-white/20">Reports</RouterLink>
      </nav>
      <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <h1 class="text-3xl font-semibold tracking-tight text-white">{{ pageTitle }}</h1>
      </div>
    </header>

    <!-- Dynamic Content Section -->
    <main class="content -mt-32">
        <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <slot></slot>
        </div>
    </main>

    <DevTools />

    <!-- Footer Section -->
    <footer class="footer px-6 py-2">
      <p>&copy 2024 Gergő Almási. All rights reserved.</p>
      <!-- Add your footer content here -->
    </footer>
  </div>
</template>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>