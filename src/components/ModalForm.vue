<script setup>
    import { inject, watch, onMounted } from 'vue'
    import Multiselect from 'vue-multiselect'

    // Inject the centralized shared store
const sharedStore = inject('useSharedStore')

if (!sharedStore) {
  console.error('useSharedStore was not provided!')
}

const {
    isLogModalShown,
    submitForm,
    resetForm,
    isEditMode,
    form,
    projects,
    users,
    tags,
    addNewProject,
    addNewUser,
    addNewTag,
} = sharedStore
</script>

<template>
    <div v-if="isLogModalShown" class="fixed flex justify-center items-center inset-0 z-10 w-auto h-auto">
          <div class="absolute inset-0 z-1 bg-slate-700/75" @click="resetForm"></div>
    <!-- Task Form -->
    <div class="relative max-w-[767px] w-full mx-4 bg-white border rounded py-6 px-6 h-auto max-h-screen overflow-y-auto lg:overflow-y-visible z-2">
      <div class="absolute w-8 h-8 flex justify-center items-center right-6 top-6 rounded border border-gray-300 hover:bg-slate-100 text-slate-500 hover:text-slate-600 text-xl cursor-pointer" @click="resetForm">×</div>
      <h2 class="text-xl font-bold mb-4">
        {{ isEditMode ? "Edit Time log" : "Add Time log" }}
      </h2>
      
      <div class="flex gap-4 grow">
        <div class="flex flex-col gap-4 grow">
          <div class="flex flex-col gap-2">
            <label class="block font-semibold">Title</label>
            <input 
              v-model="form.title" 
              type="text" 
              class="block w-full border rounded p-2" 
              placeholder="Task Title" 
            />
          </div>
          <div clasS="flex flex-col gap-2">
            <label class="block font-semibold">Project</label>
            <multiselect v-model="form.project_id" tag-placeholder="Add this as new project" placeholder="Search or add a project" label="title"
                      track-by="project_id" :options="projects" :multiple="false" :taggable="true" @tag="addNewProject"></multiselect>
          </div>
          <div clasS="flex flex-col gap-2">
            <label class="block font-semibold">Tags</label>
            <multiselect v-model="form.tag_ids" tag-placeholder="Add this as new tag" placeholder="Search or add a tag" label="title"
                      track-by="tag_id" :options="tags" :multiple="true" :taggable="true" @tag="addNewTag" ></multiselect>
          </div>
          <div class="flex flex-col gap-2">
            <label class="block font-semibold">Description</label>
            <textarea 
              v-model="form.description" 
              class="block w-full border rounded p-2" 
              placeholder="Task Description">
            </textarea>
          </div>
        </div>
        <div class="flex flex-col gap-4 w-[40%] max-w-[250px] min-w-[150px]">
          <div class="flex flex-col gap-2">
            <label class="block font-semibold">User</label>
            <multiselect v-model="form.user_id" tag-placeholder="Add this as new user" placeholder="Search or add a user" label="name"
                      track-by="user_id" :options="users" :multiple="false" :taggable="true" @tag="addNewUser"></multiselect>
          </div>
          <div class="flex flex-col gap-2">
            <label class="block font-semibold">Date</label>
            <VueDatePicker v-model="form.date" :enable-time-picker="false" :six-weeks="true" auto-apply format="yyyy-MM-dd" />
          </div>
          <div class="flex flex-col gap-2">
            <label class="block font-semibold">Start Time</label>
            <VueDatePicker v-model="form.start_time" time-picker enable-seconds auto-apply format="HH:mm:ss"  />
          </div>
          <div class="flex flex-col gap-2">
            <label class="block font-semibold">End Time</label>
            <VueDatePicker v-model="form.end_time" time-picker enable-seconds auto-apply format="HH:mm:ss" />
          </div>
        </div>
      </div>
    
      <!-- Billable -->
      <!--<label class="block mb-2 font-semibold">Billable</label>
      <select 
        v-model="form.billable" 
        class="block w-full border rounded p-2 mb-4">
        <option :value="true">Yes</option>
        <option :value="false">No</option>
      </select>-->

      <!-- Status -->
      <!--<label class="block mb-2 font-semibold">Status</label>
      <select 
        v-model="form.status" 
        class="block w-full border rounded p-2 mb-4">
        <option value="Active">Active</option>
        <option value="Completed">Completed</option>
      </select>-->

      <div class="mt-4">
        <!-- Submit Button -->
        <button 
          @click="submitForm" 
          class="px-4 py-2 bg-blue-500 hover:bg-blue-400 text-white rounded">
          {{ isEditMode ? "Save Changes" : "Add Task" }}
        </button>

        <!-- Cancel Button -->
        <button 
          v-if="isEditMode" 
          @click="resetForm" 
          class="ml-2 px-4 py-2 bg-gray-500 hover:bg-gray-400 text-white rounded">
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>