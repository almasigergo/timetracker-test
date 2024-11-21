<script setup>
    import { inject, watch, onMounted } from 'vue'

    // Inject the centralized shared store
    const sharedStore = inject('useSharedStore')

    if (!sharedStore)
    {
        console.error('useSharedStore was not provided!')
    }

    const {
        populateSampleData,
        clearDatabase,
        fetchAllData,
        fetchFilteredData,
    } = sharedStore
</script>

<template>
    <div class="p-8 pt-32 pb-16 flex justify-center items-center gap-4 flex-col lg:flex-row">
        <button @click="populateSampleData" class="px-2 whitespace-nowrap text-sm text-slate-600 font-semibold underline hover:text-slate-900">Pre-Populate Database with Sample Data</button>
        <button @click="fetchAllData" class="px-2 whitespace-nowrap text-sm text-slate-600 font-semibold underline hover:text-slate-900">Fetch All Timelog Data</button>
        <button @click="fetchFilteredData" class="px-2 whitespace-nowrap text-sm text-slate-600 font-semibold underline hover:text-slate-900">Force Fetch Filtered Timelog Data</button>
        <button @click="clearDatabase" class="px-2 whitespace-nowrap text-sm text-red-600 font-semibold underline hover:text-red-900">Clear Database</button>
    </div>
</template>