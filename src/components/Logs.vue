<script setup>
    import { inject, watch, onMounted, defineProps } from 'vue'
    import { calculateDuration, calculateTotalHours, calculateTaskDuration } from '@/include/calcDuration'

    // Inject the centralized shared store
    const sharedStore = inject('useSharedStore')

    if (!sharedStore) {
    console.error('useSharedStore was not provided!')
    }

    const {
        items,
        bulkDeleteTasks,
        addNewTask,
        toggleTaskSelection,
        editTask,
        deleteSingleTask,
        selectedTasks,
        today,
        selectedDate,
        selectedNextDate,
        selectedPrevDate,
        setDay,
        fetchFiltersData,
        fetchFilteredData
    } = sharedStore

    const data = defineProps({
        daySwitcher: Boolean,
    })

    onMounted(async() => {
        await fetchFiltersData()
        fetchFilteredData()
    })
</script>

<template>
    <div :class="{ 'bg-white rounded p-6': daySwitcher }">
        <div class="flex flex-col lg:flex-row gap-4 justify-between items-center mt-4 mb-4">
            <button 
            v-if="daySwitcher"
            @click="addNewTask"
            class="px-3 py-2 bg-blue-500 hover:bg-blue-400 disabled:bg-gray-300 cursor-pointer disabled:cursor-not-allowed text-white rounded w-full lg:w-auto"
            >
            Add new time log
            </button>
            <div v-if="daySwitcher" class="ml-4 flex items-center gap-4 flex-col lg:flex-row w-full lg:w-auto">
                <button 
                :alt="selectedPrevDate"
                :title="selectedPrevDate"
                @click="setDay('prev')"
                class="px-3 py-2 bg-blue-500 hover:bg-blue-400 disabled:bg-gray-300 cursor-pointer disabled:cursor-not-allowed text-white rounded w-full lg:w-auto"
                >Previous</button>
                <div class="whitespace-nowrap text-sm text-slate-600 text-slate-900 order-first lg:order-none">
                    Selected Day: <span class="font-semibold">{{ selectedDate }}</span>
                </div>
                <button 
                :alt="today"
                :title="today"
                @click="setDay"
                class="px-3 py-2 bg-blue-500 hover:bg-blue-400 disabled:bg-gray-300 cursor-pointer disabled:cursor-not-allowed text-white rounded w-full lg:w-auto"
                >Today</button>
                <button 
                :alt="selectedNextDate"
                :title="selectedNextDate"
                @click="setDay('next')"
                class="px-3 py-2 bg-blue-500 hover:bg-blue-400 disabled:bg-gray-300 cursor-pointer disabled:cursor-not-allowed text-white rounded w-full lg:w-auto"
                >Next</button>
            </div>
        </div>
        <div class="flex gap-4 justify-between items-center mt-4 mb-4">
            <button 
                v-if="!daySwitcher"
                @click="addNewTask"
                class="px-3 py-2 bg-blue-500 hover:bg-blue-400 disabled:bg-gray-300 cursor-pointer disabled:cursor-not-allowed text-white rounded"
                >
                Add new time log
            </button>
            <div v-if="daySwitcher"></div>
            <p v-if="items.length > 0" class="whitespace-nowrap text-sm text-slate-600">Total Duration: <span class="font-semibold text-slate-900">{{ calculateTotalHours(items) }}</span></p>
        </div>
        <div class="rounded bg-white flex justify-center items-center w-full">
            <div :class="['w-full', { 'p-6': !daySwitcher }]">
                <ul v-if="items.length > 0" class="rounded overflow-hidden border border-slate-200 w-full">
                    <li class="bg-slate-100 px-6 hidden lg:list-item rouned w-full">
                        <div class="grid grid-cols-1 lg:grid-cols-[1rem_3fr_1fr_2fr_1fr_1fr] gap-4 group">
                            <div class="flex items-center"></div>
                            <div class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-600 flex items-center justify-start">Task</div> 
                            <div class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-600 flex items-center justify-center">Date</div>
                            <div class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-600 flex items-center justify-center">Start time - End time</div>
                            <div class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-600 flex items-center justify-center">Duration</div>
                            <div class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-600 flex items-center justify-center min-w-[135px]">Action</div>
                        </div>
                    </li>
                    <li v-for="item in items" :key="item.key" class="even:bg-white odd:bg-slate-50 px-6 py-6 lg:py-0">
                        <div class="grid grid-cols-1 lg:grid-cols-[1rem_3fr_1fr_2fr_1fr_1fr] gap-4 group">
                            <div class="flex items-center">
                                <input 
                                type="checkbox" 
                                :checked="selectedTasks.includes(item.id)"
                                :value="item.id" 
                                @change="toggleTaskSelection(item.id, $event.target.checked)"
                                class="w-4 lg:w-full h-4 rounded cursor-pointer checked:bg-blue-500 border-2 border-gray-200 checked:border-blue-500 hover:border-blue-500 ring-blue-500 ring-offset-2 focus:ring-2"
                                />
                            </div>
                            <div class="px-0 lg:px-6 lg:py-4 gap-4 lg:gap-2 justify-center flex flex-col">
                                <div class="whitespace-nowrap text-sm lg:font-medium text-slate-900 flex justify-between lg:justify-start">
                                <span class="text-slate-600 font-medium lg:hidden">Task</span>{{ item.title }}
                                </div>
                                <div v-if="item.matchingTags?.length > 0" class="flex gap-2 justify-between lg:justify-start">
                                <span class="text-slate-600 text-sm font-medium lg:hidden">Tags</span>
                                <div class="flex gap-2 justify-between lg:justify-start">
                                    <div v-for="matchingTag in item.matchingTags" :key="matchingTag.tag_id" class="py-1 px-2 bg-blue-100 text-blue-600 text-xs inline-block text-center rounded">
                                    {{ matchingTag.title }}
                                    </div>
                                </div>
                                </div>
                                <div v-if="item.description?.length > 0" class="whitespace-nowrap text-sm text-slate-900 flex justify-between lg:justify-start">
                                <span class="text-slate-600 font-medium lg:hidden">Description</span>{{ item.description }}
                                </div>
                            </div>
                            <div class="px-0 lg:px-6 lg:py-4 whitespace-nowrap text-sm text-slate-600 flex items-center justify-between lg:justify-center"><span class="font-medium lg:hidden">Date</span>{{ item.date }}</div>
                            <div class="px-0 lg:px-6 lg:py-4 whitespace-nowrap text-sm text-slate-600 flex items-center justify-between lg:justify-center"><span class="font-medium lg:hidden">Start - End</span>{{ item.start_time }} - {{ item.end_time }}</div>
                            <div class="px-0 lg:px-6 lg:py-4 whitespace-nowrap text-sm text-slate-600 flex items-center justify-between lg:justify-center"><span class="font-medium lg:hidden">Duration</span>{{ calculateDuration(item.start_time, item.end_time) }}</div>
                            <div class="opacity-100 lg:opacity-0 group-hover:opacity-100 flex items-center justify-between lg:justify-center gap-2 px-0">
                                <!-- Edit Button -->
                                <button 
                                @click="editTask(item)"
                                class="px-3 py-1 bg-blue-500 hover:bg-blue-400 text-white rounded"
                                >
                                Edit
                                </button>

                                <!-- Delete Button -->
                                <button 
                                @click="deleteSingleTask(item.id)"
                                class="px-3 py-1 bg-red-500 hover:bg-red-400 text-white rounded"
                                >
                                Delete
                                </button>
                            </div>
                        </div>
                    </li>
                </ul>
                <p v-else class="text-center">No hours tracked for this day yet.</p>
            </div>
        </div>
    </div>
    <div class="flex gap-4 justify-between items-center mt-4">
        <button 
        v-if="items.length > 0"
        @click="bulkDeleteTasks"
        class="px-3 py-2 bg-red-600 hover:bg-red-500 disabled:bg-gray-300 cursor-pointer disabled:cursor-not-allowed text-white rounded"
        :disabled="selectedTasks.length === 0"
        >
        Delete Selected Tasks
        </button>
        <p v-if="items.length > 0" class="whitespace-nowrap text-sm text-slate-600">Total Duration: <span class="font-semibold text-slate-900">{{ calculateTotalHours(items) }}</span></p>
    </div>
</template>