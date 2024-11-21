import { ref, reactive, toRaw, watch } from 'vue'
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, addDays, subDays } from 'date-fns'
import { calculateDuration, calculateTotalHours, calculateTaskDuration } from '@/include/calcDuration'
import { populateSampleData, clearDatabase } from '@/include/populateSampleDataToDb'
import { 
  getAllTasks, 
  getFilteredTasks, 
  getAllProjects, 
  getAllUsers, 
  getAllTags, 
  addTask, 
  updateTask, 
  deleteTask, 
  addTag, 
  addUser, 
  addProject 
} from '@/include/indexedDbService'
import { useToast } from "vue-toastification"

const toast = useToast()

const useSharedStore = () => {  
  const items = ref([])
  const selectedTasks = ref([])
  const filters = reactive({
    date: { start_date: format(new Date(), 'yyyy-MM-dd'),  end_date: format(new Date(), 'yyyy-MM-dd') },
    project_ids: [],
    user_ids: [],
    tag_ids: [],
    title_search: '',
    description_search: ''
  })

  const filterTags = ref([])
  const filterUser = ref([])
  const filterProject = ref([])

  const projects = ref([])
  const users = ref([])
  const tags = ref([])

  // Preset dates for filtering
  const date = ref([new Date(), new Date()])
  const selectedDate = ref(format(new Date(), 'yyyy-MM-dd'))
  const today = ref(format(new Date(), 'yyyy-MM-dd'))
  const selectedNextDate = ref(format(addDays(new Date(selectedDate.value), 1), 'yyyy-MM-dd'))
  const selectedPrevDate = ref(format(subDays(new Date(selectedDate.value), 1), 'yyyy-MM-dd'))

  const setDay = async (selected) => {

    let requestedDate = today

    switch (selected)
    {
      case 'next':
        requestedDate = selectedNextDate
        break
      case 'prev':
        requestedDate = selectedPrevDate
        break
      default:
        requestedDate = today
        break
    }

    selectedDate.value = requestedDate.value
    
    filters.date = {
      start_date: requestedDate.value,
      end_date: requestedDate.value
    }

    fetchFilteredData()
    
  }
  

  watch(selectedDate, (newDate) => {
    selectedNextDate.value = format(addDays(new Date(newDate), 1), 'yyyy-MM-dd')
    selectedPrevDate.value = format(subDays(new Date(newDate), 1), 'yyyy-MM-dd')
  })

  const presetDates = ref([
    { label: 'Today', value: [new Date(), new Date()] },
    { label: 'This week', value: [startOfWeek(new Date(), { weekStartsOn: 1 }), endOfWeek(new Date(), { weekStartsOn: 1 })] },
    { label: 'This month', value: [startOfMonth(new Date()), endOfMonth(new Date())] },
    { label: 'This year', value: [startOfYear(new Date()), endOfYear(new Date())] }
  ])

  const isEditMode = ref(false)
  const isLogModalShown = ref(false)
  const startTime = ref(new Date())
  const endTime = ref(new Date(startTime.value.getTime() + (1000 * 60 * 60)))

  
  const form = reactive({
    id: null,
    title: '',
    description: '',
    date: selectedDate.value,
    start_time: {hours: startTime.value.getHours(), minutes: startTime.value.getMinutes(), seconds: startTime.value.getSeconds()},
    end_time: {hours: endTime.value.getHours(), minutes: endTime.value.getMinutes(), seconds: endTime.value.getSeconds()},
    billable: true,
    project_id: null,
    user_id: null,
    tag_ids: [],
    status: 'Active',
  })
  
  const fetchAllData = async () => {
    items.value = await getAllTasks()
  }

  const fetchFiltersData = async () => {
    projects.value = await getAllProjects()
    users.value = await getAllUsers()
    tags.value = await getAllTags()
  }

  const fetchFilteredData = async () => {

    filters.tag_ids = filterTags.value.map(item => item.tag_id)
    filters.user_ids = filterUser.value.map(item => item.user_id)
    filters.project_ids = filterProject.value.map(item => item.project_id)
  
    const filteredTasks = await getFilteredTasks(filters)
  
    items.value = filteredTasks
    
    if(filteredTasks.length > 0)
    {
      const filteredTasksWithTags = filteredTasks.map((task) => {
        return {
          ...task,
          matchingTags: tags.value.filter((tag) => task.tag_ids.includes(tag.tag_id))
        }
      })
  
      items.value = filteredTasksWithTags
      updateChartHoursData(filteredTasksWithTags)
      updateChartTagsData(filteredTasksWithTags)
      updateChartUserData(filteredTasksWithTags)
      updateChartProjectData(filteredTasksWithTags)
    }
    
  }

  const handleDate = (modelData) => {

    if(date.value === null)
    {
      filters.date = {
        start_date: selectedDate.value,
        end_date: selectedDate.value
      }
  
      fetchFilteredData()
  
      return
    }
  
    let startDate = null
    let endDate = null
  
    if (Array.isArray(date.value)) 
    {
  
        startDate = convertDates(date.value[0])
        endDate = convertDates(date.value[1])
  
    } 
    else 
    {
        startDate = convertDates(date.value)
        endDate = startDate
    }
  
    filters.date = {
      start_date: startDate,
      end_date: endDate
    }
  
    fetchFilteredData()
  
  }

  // Reset the form
  const resetForm = () => {

    startTime.value = new Date()
    endTime.value = new Date(startTime.value.getTime() + (1000 * 60 * 60))
    isLogModalShown.value = false

    form.id = null
    form.title = ''
    form.description = ''
    form.date = selectedDate.value
    form.start_time = {hours: startTime.value.getHours(), minutes: startTime.value.getMinutes(), seconds: startTime.value.getSeconds()}
    form.end_time = {hours: endTime.value.getHours(), minutes: endTime.value.getMinutes(), seconds: endTime.value.getSeconds()}
    form.billable = true
    form.project_id = null
    form.user_id = null
    form.tag_ids = []
    form.status = 'Active'
    isEditMode.value = false

    
  }

  // Submit the form
  const submitForm = async () => {
    
    if (!form.title || !form.date || !form.start_time || !form.end_time || !form.tag_ids || !form.project_id || !form.user_id)
    {
      toast.info("Please fill in all required fields.")
      return
    }

    try {
      form.date = format(new Date(form.date), 'yyyy-MM-dd')
      form.start_time = formatTime(form.start_time)
      form.end_time = formatTime(form.end_time)
      form.tag_ids = form.tag_ids.map(item => item.tag_id)
      form.project_id = form.project_id.project_id
      form.user_id = form.user_id.user_id

      const plainForm = toRaw(form)

      if (isEditMode.value) 
      {
        // Update task
        try 
        {
          await updateTask(plainForm)
          toast.success("Task updated successfully!")
        }
        catch(error) 
        {
          toast.error("Task updating failed!")
        }

        
      } 
      else
      {
        // Add new task
        // Ensure no ID is passed for new tasks
        delete plainForm.id

        try 
        {
          await addTask({ ...plainForm })
          toast.success("Task added successfully!")
        }
        catch(error) 
        {
          toast.error("Task adding failed!")
        }
      }

      resetForm() 
      fetchFilteredData()
    } catch (error) {
      toast.error("Failed to submit the form. Please check the console for more details.")
      console.error('Error while submitting the form:', error)
    }
  }

  // Populate the form for editing
  const editTask = (task) => {
    
    form.id = task.id
    form.title = task.title
    form.description = task.description
    form.date = task.date
    form.start_time = convertToVueDatePickerDate(task.start_time)
    form.end_time = convertToVueDatePickerDate(task.end_time)
    form.billable = task.billable
    form.project_id = projects.value.filter((project) => task.project_id === project.project_id)[0]
    form.user_id = users.value.filter((user) => task.user_id === user.user_id)[0]
    form.tag_ids = tags.value.filter((tag) => task.tag_ids.includes(tag.tag_id))//[...task.tag_ids]
    form.status = task.status
    isEditMode.value = true

    isLogModalShown.value = true
  }

  const formatTime = (date) => {
    if (!date) return ''
    
    const hours = String(date.hours).padStart(2, '0')
    const minutes = String(date.minutes).padStart(2, '0')
    const seconds = String(date.seconds).padStart(2, '0')

    return `${hours}:${minutes}:${seconds}`
  }

  const toggleTaskSelection = (taskId, isSelected) => {
    if (isSelected) {
      selectedTasks.value.push(taskId)
    } else {
      selectedTasks.value = selectedTasks.value.filter((id) => id !== taskId)
    }
  }

  const deleteSingleTask = async (taskId) => {
    const confirmDelete = confirm("Are you sure you want to delete this task?")
    if (!confirmDelete) return

    await deleteTask(taskId)
    toast.success("Task deleted successfully.")
    fetchFilteredData()
  }

  const bulkDeleteTasks = async () => {
    const confirmDelete = confirm("Are you sure you want to delete selected tasks?")
    if (!confirmDelete) return

    for (const taskId of selectedTasks.value) {
      await deleteTask(taskId)
    }

    selectedTasks.value = []
    toast.success("Selected tasks deleted successfully.")
    fetchFilteredData()
  }

  const addNewTag = async (newTag) => {
    const tag = {
      title: newTag,
    }
    const tagDbId = await addTag(tag)
    tag.tag_id = tagDbId

    tags.value.push(tag)
    
    if(isLogModalShown) form.tag_ids.push(tag)
    else filterTags.value.push(tag)

    fetchFilteredData()
  }

  const addNewUser = async (newUser) => {
    const user = {
      name: newUser,
    }
    const userDbId = await addUser(user)
    user.user_id = userDbId

    users.value.push(user)

    if(isLogModalShown) form.user_id = user
    else filterUser.value.push(user)

    fetchFilteredData()
  }

  const addNewProject = async (newProject) => {
      const project = {
        title: newProject,
      }
      const projectDbId = await addProject(project)
      project.project_id = projectDbId

      projects.value.push(project)

      if(isLogModalShown) form.project_id = project
      else filterProject.value.push(project)

      fetchFilteredData()
  }

  // Function to convert HH:mm:ss string into Date object
  const convertToVueDatePickerDate = (time) => {
    const [hours, minutes, seconds] = time.split(':').map(Number)
    
    return {hours: hours, minutes: minutes, seconds: seconds}
  }

  const addNewTask = async () => {
    form.date = selectedDate.value
    isLogModalShown.value = true
  }

  const convertDates = (dateToConvert) => {

    const day = dateToConvert.getDate()
    const month = dateToConvert.getMonth() + 1
    const year = dateToConvert.getFullYear()
  
    return year + "-" + month + "-" + day
  }
  
  selectedDate.value = convertDates(new Date())

  const chartHoursRef = ref(null)
  const chartTagsRef = ref(null)
  const chartUserRef = ref(null)
  const chartProjectRef = ref(null)

  const chartHoursData = {
    labels: ['Title'],
    datasets: [{
        backgroundColor: [
        '#FFB3BA', '#FFDFBA', '#FFFFBA', '#BAFFC9', '#BAE1FF',
        '#FFC0CB', '#FFD1DC', '#FFF5BA', '#D4FFEA', '#BAE1FF',
        '#B0E0E6', '#E6E6FA', '#F5DEB3', '#D8BFD8', '#D3D3D3',
        '#E6FFE6', '#FFFACD', '#F0E68C', '#E0FFFF', '#F5F5DC' 
        ],
        data: [1]
    }]
}

const chartTagsData = chartHoursData
const chartUserData = chartHoursData
const chartProjectData = chartHoursData

const updateChartHoursData = (tasks) => {
    
    const chart = chartHoursRef.value?.chart

    if (chart) {
    
        chart.data.labels = tasks.map((task) => task.title) // Extract task titles
        chart.data.datasets[0].data = tasks.map((task) =>
            calculateTaskDuration(task.start_time, task.end_time)
        )
        chart.data.datasets[0].labels = tasks.map((task) =>
        task.start_time
        )

        // Trigger Chart.js to re-render
        chart.update()
    } 
    else 
    {
        console.error('Chart instance is not available.')
    }

}

const updateChartTagsData = (tasks) => {

    const chart = chartTagsRef.value?.chart

    if (chart) 
    {
        const tagCount = tasks.reduce((acc, task) => {
            task.matchingTags.forEach(tag => {
                acc[tag.title] = (acc[tag.title] || 0) + 1
            })
            return acc
        }, {})

        const labels = Object.keys(tagCount)
        const data = Object.values(tagCount)

        // Update chart
        chart.data.labels = labels
        chart.data.datasets[0].data = data

        chart.update()
    }
    else
    {
        console.error('Chart Tags instance is not available.')
    }
}

const updateChartUserData = (tasks) => {

    const chart = chartUserRef.value?.chart

    if (chart) 
    {
        const userTaskCount = tasks.reduce((acc, task) => {
            if (!acc[task.user_id]) 
            {
                acc[task.user_id] = 0
            }
            acc[task.user_id]++
            return acc
        }, {})

        
        const chartLabels = users.value
            .filter((user) => userTaskCount[user.user_id])
            .map((user) => user.name)

        const chartData = users.value
            .filter((user) => userTaskCount[user.user_id])
            .map((user) => userTaskCount[user.user_id])

        // Update chart
        chart.data.labels = chartLabels
        chart.data.datasets[0].data = chartData

        chart.update()
    } 
    else 
    {
        console.error('Chart Tags instance is not available.')
    }
}

const updateChartProjectData = (tasks) => {

    const chart = chartProjectRef.value?.chart

    if (chart) 
    {
        const projectTaskCount = tasks.reduce((acc, task) => {
            if (!acc[task.project_id])
            {
                acc[task.project_id] = 0
            }
            acc[task.project_id]++
            return acc
        }, {})

        
        const chartLabels = projects.value
            .filter((project) => projectTaskCount[project.project_id])
            .map((project) => project.title)

        const chartData = projects.value
            .filter((project) => projectTaskCount[project.project_id])
            .map((project) => projectTaskCount[project.project_id])

        // Update chart
        chart.data.labels = chartLabels
        chart.data.datasets[0].data = chartData

        chart.update()
    } 
    else 
    {
        console.error('Chart Tags instance is not available.')
    }
}

  return {
    // States
    items,
    selectedTasks,
    filters,
    filterTags,
    filterUser,
    filterProject,
    projects,
    users,
    tags,
    form,
    date,
    today,
    selectedDate,
    selectedNextDate,
    selectedPrevDate,
    presetDates,
    // Methods
    fetchAllData,
    fetchFiltersData,
    fetchFilteredData,
    resetForm,
    submitForm,
    deleteSingleTask,
    bulkDeleteTasks,
    editTask,
    addNewTask,
    addNewTag,
    addNewUser,
    addNewProject,
    handleDate,
    chartHoursRef,
    chartTagsRef,
    chartUserRef,
    chartProjectRef,
    chartHoursData,
    chartTagsData,
    chartUserData,
    chartProjectData,
    toggleTaskSelection,
    convertToVueDatePickerDate,
    isLogModalShown,
    isEditMode,
    setDay,
    populateSampleData,
    clearDatabase,
  }

}

export default useSharedStore
