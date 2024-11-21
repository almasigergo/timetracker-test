// src/include/indexedDbService.ts
import { openDB } from 'idb'
import type { DBSchema } from 'idb'

// Define the database schema
interface MyDatabase extends DBSchema {
  tasks: {
    key: number
    value: {
      id: number
      title: string
      description: string
      date: string
      start_time: string
      end_time: string
      billable: boolean
      project_id: number
      user_id: number
      tag_ids: number[]
      status: string
    }
  }
  users: {
    key: number
    value: {
      user_id: number
      name: string
      image: string
    }
  }
  projects: {
    key: number
    value: {
      project_id: number
      title: string
    }
  }
  tags: {
    key: number
    value: {
      tag_id: number
      title: string
      color: string
    }
  }
} 

// Initialize the database
export const initDB = async () => {
  return openDB<MyDatabase>('TimetrackerTestDB', 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('tasks')) {
        db.createObjectStore('tasks', { keyPath: 'id', autoIncrement: true })
      }
      if (!db.objectStoreNames.contains('users')) {
        db.createObjectStore('users', { keyPath: 'user_id', autoIncrement: true })
      }
      if (!db.objectStoreNames.contains('projects')) {
        db.createObjectStore('projects', { keyPath: 'project_id', autoIncrement: true })
      }
      if (!db.objectStoreNames.contains('tags')) {
        db.createObjectStore('tags', { keyPath: 'tag_id', autoIncrement: true })
      }
    }
  })
}


//Tasks table
export const addTask = async (task: MyDatabase['tasks']['value']) => {
  const db = await initDB()
  return db.add('tasks', task)
}

export const updateTask = async (task: MyDatabase['tasks']['value']) => {
  const db = await initDB()
  return db.put('tasks', task)
}

export const getTask = async (id: number) => {
  const db = await initDB()
  return db.get('tasks', id)
}

export const deleteTask = async (id: number) => {
  const db = await initDB()
  return db.delete('tasks', id)
}

export const getAllTasks = async () => {
  const db = await initDB()
  return db.getAll('tasks')
}

//Users table
export const addUser = async (user: MyDatabase['users']['value']) => {
  const db = await initDB()
  return db.add('users', user)
}

export const updateUser = async (user: MyDatabase['users']['value']) => {
  const db = await initDB()
  return db.put('users', user)
}

export const getUser = async (user_id: number) => {
  const db = await initDB()
  return db.get('users', user_id)
}

export const deleteUser = async (user_id: number) => {
  const db = await initDB()
  return db.delete('users', user_id)
}

export const getAllUsers = async () => {
  const db = await initDB()
  return db.getAll('users')
}

//Projects table
export const addProject = async (project: MyDatabase['projects']['value']) => {
  const db = await initDB()
  return db.add('projects', project)
}

export const updateProject = async (project: MyDatabase['projects']['value']) => {
  const db = await initDB()
  return db.put('projects', project)
}

export const getProject = async (project_id: number) => {
  const db = await initDB()
  return db.get('projects', project_id)
}

export const deleteProject = async (project_id: number) => {
  const db = await initDB()
  return db.delete('projects', project_id)
}

export const getAllProjects = async () => {
  const db = await initDB()
  return db.getAll('projects')
}

//Tags table
export const addTag = async (tag: MyDatabase['tags']['value']) => {
  const db = await initDB()
  return db.add('tags', tag)
}

export const updateTag = async (tag: MyDatabase['tags']['value']) => {
  const db = await initDB()
  return db.put('tags', tag)
}

export const getTag = async (tag_id: number) => {
  const db = await initDB()
  return db.get('tags', tag_id)
}

export const deleteTag = async (tag_id: number) => {
  const db = await initDB()
  return db.delete('tags', tag_id)
}

export const getAllTags = async () => {
  const db = await initDB()
  return db.getAll('tags')
}

interface TaskFilter {
  date: { start_date: string; end_date?: string } // Mandatory filter
  project_ids?: number[] // Optional
  tag_ids?: number[] // Optional
  user_ids?: number[] // Optional
  billable?: boolean // Optional
  title_search?: string // Optional
  description_search?: string // Optional
}

export const getFilteredTasks = async (filters: TaskFilter) => {
  const db = await initDB()

  // Ensure date filter is present
  const startDate = filters.date.start_date
  const endDate = filters.date.end_date || startDate // Default to the same day if no end_date

  // Fetch all tasks
  const tasks = await db.getAll('tasks')

  // Apply filters
  const filteredTasks = tasks.filter((task) => {
    // 1. Date filter (mandatory)
    const taskDate = new Date(task.date)
    const start = new Date(startDate)
    const end = new Date(endDate)
    if (taskDate < start || taskDate > end) return false

    // 2. Project filter
    if (
      filters.project_ids &&
      filters.project_ids.length > 0 && // Ensure it's not an empty array
      !filters.project_ids.includes(task.project_id)
    ) {
      return false
    }

    // 3. Tags filter
    if (
      filters.tag_ids &&
      filters.tag_ids.length > 0 && // Ensure it's not an empty array
      !filters.tag_ids.some((tagId) => task.tag_ids.includes(tagId))
    ) {
      return false
    }

    // 4. User filter
    if (
      filters.user_ids &&
      filters.user_ids.length > 0 && // Ensure it's not an empty array
      !filters.user_ids.includes(task.user_id)
    ) {
      return false
    }

    // 5. Billable filter
    if (filters.billable !== undefined && task.billable !== filters.billable) {
      return false
    }

    // 6. Title search filter
    if (
      filters.title_search &&
      (!task.title || // Handle cases where title is missing or undefined
      !task.title.toLowerCase().includes(filters.title_search.toLowerCase()))
    ) {
      return false
    }

    // 7. Description search filter
    if (
      filters.description_search &&
      (!task.description || // Handle cases where description is missing or undefined
        !task.description
          .toLowerCase()
          .includes(filters.description_search.toLowerCase()))
    ) {
      return false
    }

    return true
  })

  // Sort tasks by date and time in DESC order
  const sortedTasks = filteredTasks.sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.start_time}`)
    const dateB = new Date(`${b.date}T${b.start_time}`)

    return dateB.getTime() - dateA.getTime() // DESC order
  })

  return sortedTasks
}
