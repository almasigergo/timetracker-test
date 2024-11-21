<script setup>
    import { ref, defineProps, defineExpose, inject } from 'vue'
    import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
    import { Pie } from 'vue-chartjs'
    import * as chartConfig from '@/include/chartConfig'
    import { calculateDuration, calculateTotalHours, calculateTaskDuration } from '@/include/calcDuration'

    ChartJS.register(ArcElement, Tooltip, Legend)

    // Inject the centralized shared store
    const sharedStore = inject('useSharedStore')

    if (!sharedStore) {
      console.error('useSharedStore was not provided!')
    }

    const {
        projects,
        users,
        tags,
        items,
        chartHoursRef,
        chartTagsRef,
        chartUserRef,
        chartProjectRef,
        chartHoursData,
        chartTagsData,
        chartUserData,
        chartProjectData,
    } = sharedStore

    const showCharts = ref(true)

</script>

<template>
  <div :class="{ 'hidden': items.length === 0 || (items.length > 0 && !showCharts) }">
    <div class="w-full py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 chartsContainer gap-4">
      <div class="flex flex-col gap-2">
        <label class="block mb-2 font-semibold text-center">Time Spent on Tasks</label>
        <Pie :data="chartHoursData" :options="chartConfig.optionsHours" ref="chartHoursRef" />
      </div>
      <div class="flex flex-col gap-2">
        <label class="block mb-2 font-semibold text-center">Number of Tasks per Project</label>
        <Pie :data="chartProjectData" :options="chartConfig.options" ref="chartProjectRef" />
      </div>  
      <div class="flex flex-col gap-2">
        <label class="block mb-2 font-semibold text-center">Number of Tasks per Tags</label>
        <Pie :data="chartTagsData" :options="chartConfig.options" ref="chartTagsRef" />
      </div>
      <div class="flex flex-col gap-2">
        <label class="block mb-2 font-semibold text-center">Number of Tasks per Users</label>
        <Pie :data="chartUserData" :options="chartConfig.options" ref="chartUserRef" />
      </div>
    </div>
  </div>
  <div v-if="items.length > 0" class="flex justify-center mt-4 mb-4">
    <button 
        @click="showCharts = !showCharts" 
        class="px-3 py-2 bg-blue-500 hover:bg-blue-400 disabled:bg-gray-300 cursor-pointer disabled:cursor-not-allowed text-white rounded"
    >
        {{ showCharts ? "Hide Charts" : "Show Charts"}}
    </button>
  </div>
</template>
<style scoped>
  .chartsContainer canvas {
    width: 100% !important;
    aspect-ratio: 1 / 1;
    height: auto !important;
  }
</style>