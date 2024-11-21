<script setup>
import { inject, watch, onMounted } from 'vue'
import Multiselect from 'vue-multiselect'

// Inject the centralized shared store
const sharedStore = inject('useSharedStore')

if (!sharedStore) {
  console.error('useSharedStore was not provided!')
}

const {
  filters,
  fetchFiltersData,
  fetchFilteredData,
  filterTags,
  filterUser,
  filterProject,
  presetDates,
  addNewTag,
  addNewUser,
  addNewProject,
  projects,
  users,
  tags,
  items,
  date,
  handleDate,
} = sharedStore

// Watch for changes in local filters and update shared filters
watch([filterTags, filterUser, filterProject], () => {
  // Automatically update shared filters and fetch data
  fetchFilteredData()
})

watch(filters.date, () => {
  fetchFilteredData()
})

onMounted(async() => {
  //await fetchFiltersData()
  //fetchFilteredData()
})
</script>

<template>
  <!-- Filters Section -->
  <div class="bg-white rounded p-6">
    <h2 class="text-lg font-semibold text-gray-900">Filters</h2>
    <div class="mx-auto py-6 flex flex-col gap-4">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="">
          <label class="block mb-2 font-semibold">Task title</label>
          <input
            id="filterTitleInput"
            type="text"
            v-model="filters.title_search"
            @input="fetchFilteredData"
            placeholder="Enter title to filter tasks"
            class="h-[calc(100%-0.5rem-24px)] min-h-[40px] px-2 mt-1 block w-full rounded border border-gray-200 focus:border focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div class="">
          <label class="block mb-2 font-semibold">Description</label>
          <input
            id="filterDescriptionInput"
            type="text"
            v-model="filters.description_search"
            @input="fetchFilteredData"
            placeholder="Enter description to filter tasks"
            class="h-[calc(100%-0.5rem-24px)] min-h-[40px] px-2 mt-1 block w-full rounded border border-gray-200 focus:border focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="">
          <label class="block mb-2 font-semibold">Date</label>
          <VueDatePicker v-model="date" range :preset-dates="presetDates" :enable-time-picker="false" :six-weeks="true" auto-apply format="yyyy-MM-dd" @update:model-value="handleDate">
            <template #preset-date-range-button="{ label, value, presetDate }">
              <span 
                  role="button"
                  :tabindex="0"
                  @click="presetDate(value)"
                  @keyup.enter.prevent="presetDate(value)"
                  @keyup.space.prevent="presetDate(value)">
                {{ label }}
              </span>
            </template>
          </VueDatePicker>
        </div>
        <div class="">
          <!-- Project -->
          <label class="block mb-2 font-semibold">Project</label>
          <multiselect v-model="filterProject" tag-placeholder="Add this as new project" placeholder="Search or add a project" label="title"
                 track-by="project_id" :options="projects" :multiple="true" :taggable="true" @tag="addNewProject" @select="fetchFilteredData" @remove="fetchFilteredData"></multiselect>
        </div>
        <div class="">
          <!-- Tags -->
          <label class="block mb-2 font-semibold">Tags</label>
          <multiselect v-model="filterTags" tag-placeholder="Add this as new tag" placeholder="Search or add a tag" label="title"
               track-by="tag_id" :options="tags" :multiple="true" :taggable="true" @tag="addNewTag" @select="fetchFilteredData" @remove="fetchFilteredData" ></multiselect>
        </div>
        <div class="">
          <!-- User -->
          <label class="block mb-2 font-semibold">User</label>
          <multiselect v-model="filterUser" tag-placeholder="Add this as new user" placeholder="Search or add a user" label="name"
                 track-by="user_id" :options="users" :multiple="true" :taggable="true" @tag="addNewUser" @select="fetchFilteredData" @remove="fetchFilteredData"></multiselect>
        </div>
      </div>
    </div>
  </div>
</template>
