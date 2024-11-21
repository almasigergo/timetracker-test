import { startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns'
import { initDB } from '@/include/indexedDbService' // Adjust the path if needed

export const populateSampleData = async () => {
    const today = new Date()
    const todayStr = today.toISOString().split('T')[0]
    const thisWeekStart = startOfWeek(today, { weekStartsOn: 1 }).toISOString().split('T')[0]
    const thisWeekEnd = endOfWeek(today, { weekStartsOn: 1 }).toISOString().split('T')[0]
    const thisMonthStart = startOfMonth(today).toISOString().split('T')[0]
    const thisMonthEnd = endOfMonth(today).toISOString().split('T')[0]
  
    const users = [
      { user_id: 1, name: 'John Doe', image: 'https://via.placeholder.com/150' },
      { user_id: 2, name: 'Jane Smith', image: 'https://via.placeholder.com/150' },
    ]
  
    const projects = [
      { project_id: 1, title: 'Project Alpha' },
      { project_id: 2, title: 'Project Beta' },
      { project_id: 3, title: 'Project Gamma' },
    ]
  
    const tags = [
      { tag_id: 1, title: 'Frontend', color: '#41B883' },
      { tag_id: 2, title: 'Backend', color: '#E46651' },
      { tag_id: 3, title: 'Database', color: '#00D8FF' },
      { tag_id: 4, title: 'Testing', color: '#DD1B16' },
    ]
  
    const tasks = [
        // Tasks for today
        { title: 'Task 1', date: todayStr, start_time: '09:12:34', end_time: '11:23:45', user_id: 1, project_id: 1, tag_ids: [1, 2], billable: true, status: 'Active' },
        { title: 'Task 2', date: todayStr, start_time: '13:05:12', end_time: '15:37:54', user_id: 2, project_id: 2, tag_ids: [2, 3], billable: false, status: 'Active' },
        { title: 'Task 3', date: todayStr, start_time: '15:45:21', end_time: '18:14:32', user_id: 1, project_id: 3, tag_ids: [1, 3], billable: true, status: 'Completed' },
        { title: 'Task 4', date: todayStr, start_time: '10:02:15', end_time: '12:29:48', user_id: 2, project_id: 2, tag_ids: [4], billable: true, status: 'Active' },
        { title: 'Task 5', date: todayStr, start_time: '14:12:45', end_time: '16:54:23', user_id: 1, project_id: 1, tag_ids: [1], billable: true, status: 'Active' },
      
        // Tasks for this week
        { title: 'Task 6', date: thisWeekStart, start_time: '10:15:36', end_time: '12:47:52', user_id: 1, project_id: 1, tag_ids: [3], billable: true, status: 'Completed' },
        { title: 'Task 7', date: thisWeekStart, start_time: '12:33:45', end_time: '13:58:29', user_id: 2, project_id: 3, tag_ids: [2], billable: false, status: 'Active' },
        { title: 'Task 8', date: thisWeekEnd, start_time: '14:05:32', end_time: '16:43:21', user_id: 2, project_id: 2, tag_ids: [4], billable: true, status: 'Completed' },
        { title: 'Task 9', date: thisWeekEnd, start_time: '16:42:56', end_time: '18:31:22', user_id: 1, project_id: 3, tag_ids: [1, 4], billable: true, status: 'Active' },
        { title: 'Task 10', date: thisWeekStart, start_time: '09:13:42', end_time: '11:28:15', user_id: 1, project_id: 2, tag_ids: [2, 4], billable: false, status: 'Active' },
        { title: 'Task 11', date: thisWeekStart, start_time: '13:02:34', end_time: '15:27:43', user_id: 2, project_id: 1, tag_ids: [3], billable: true, status: 'Completed' },
        { title: 'Task 12', date: thisWeekStart, start_time: '08:31:45', end_time: '10:52:38', user_id: 2, project_id: 3, tag_ids: [2], billable: false, status: 'Completed' },
        { title: 'Task 13', date: thisWeekEnd, start_time: '17:13:42', end_time: '19:45:38', user_id: 1, project_id: 3, tag_ids: [4], billable: true, status: 'Active' },
      
        // Tasks for this month
        { title: 'Task 14', date: thisMonthStart, start_time: '09:25:18', end_time: '11:37:42', user_id: 2, project_id: 3, tag_ids: [4], billable: true, status: 'Active' },
        { title: 'Task 15', date: thisMonthEnd, start_time: '10:45:23', end_time: '12:23:11', user_id: 1, project_id: 2, tag_ids: [2], billable: false, status: 'Completed' },
        { title: 'Task 16', date: thisMonthStart, start_time: '15:12:38', end_time: '17:28:54', user_id: 1, project_id: 3, tag_ids: [1, 2], billable: true, status: 'Active' },
        { title: 'Task 17', date: thisMonthEnd, start_time: '09:15:28', end_time: '11:11:49', user_id: 2, project_id: 1, tag_ids: [3], billable: true, status: 'Completed' },
      
        // Additional random tasks to reach 30
        ...Array.from({ length: 13 }, (_, i) => {
          const randomDate = i % 2 === 0 ? thisWeekStart : thisMonthEnd
          const randomUser = i % 2 === 0 ? 1 : 2
          const randomStartHourOriginal = 8 + (i % 6) // Random hour between 8 and 13
          const randomStartHour = randomStartHourOriginal.toString().padStart(2, '0') // Random hour between 8 and 13
          const randomStartMinute = Math.floor(Math.random() * 60).toString().padStart(2, '0')
          const randomStartSecond = Math.floor(Math.random() * 60).toString().padStart(2, '0')
          const randomEndHour = (randomStartHourOriginal + 2).toString().padStart(2, '0') // Ensure end time is 2 hours after start time
          const randomEndMinute = Math.floor(Math.random() * 60).toString().padStart(2, '0')
          const randomEndSecond = Math.floor(Math.random() * 60).toString().padStart(2, '0')
      
          return {
            title: `Task ${18 + i}`,
            date: randomDate,
            start_time: `${randomStartHour}:${randomStartMinute}:${randomStartSecond}`,
            end_time: `${randomEndHour}:${randomEndMinute}:${randomEndSecond}`,
            user_id: randomUser,
            project_id: (i % 3) + 1,
            tag_ids: [(i % 4) + 1],
            billable: i % 2 === 0,
            status: i % 2 === 0 ? 'Active' : 'Completed',
          }
        }),
      ]
      
  
    const db = await initDB()
  
    // Populate users
    for (const user of users) {
      await db.add('users', user)
    }
  
    // Populate projects
    for (const project of projects) {
      await db.add('projects', project)
    }
  
    // Populate tags
    for (const tag of tags) {
      await db.add('tags', tag)
    }
  
    // Populate tasks
    for (const task of tasks) {
      await db.add('tasks', task)
    }
  
    console.log('30 sample tasks added successfully')
  }


export const clearDatabase = async () => {
    const confirmDelete = confirm("Are you sure you want to delete everything from the database?")
    if (!confirmDelete) return

    const db = await initDB()
    await db.clear('tasks')
    await db.clear('users')
    await db.clear('projects')
    await db.clear('tags')
    console.log('Database cleared successfully')
}