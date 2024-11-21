const normalizeTime = (time: string): string => {
    return time.includes(':') && time.split(':').length === 2 ? `${time}:00` : time
}

export const calculateDuration = (startTime: string, endTime: string): string => {
    // Normalize time strings to ensure they are in HH:MM:SS format
    const normalizedStartTime = normalizeTime(startTime)
    const normalizedEndTime = normalizeTime(endTime)

    // Parse the times as Date objects
    const start = new Date(`1970-01-01T${normalizedStartTime}`)
    let end = new Date(`1970-01-01T${normalizedEndTime}`)

  
    // Calculate the difference in milliseconds
    let diffMs = end.getTime() - start.getTime()
  
    if (diffMs < 0) {

        // To fix issues with late night tasks
        end = new Date(`1970-01-02T${normalizedEndTime}`)

    
        // Calculate the difference in milliseconds
        diffMs = end.getTime() - start.getTime()

        //throw new Error('End time must be after start time.')
    }
  
    // Convert to seconds, minutes, and hours
    const hours = Math.floor(diffMs / (1000 * 60 * 60))
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((diffMs % (1000 * 60)) / 1000)
  
    // Format as HH:MM:SS
    return [hours, minutes, seconds]
      .map((unit) => String(unit).padStart(2, '0')) // Add leading zero
      .join(':')
  }

 export const calculateTotalHours = (items) => {
    if (!items || items.length === 0) {
      return '0:00:00' // No tasks, return zero hours
    }
  
    let totalSeconds = 0
  
    items.forEach(task => {
      const start = new Date(`1970-01-01T${task.start_time}`)
      let end = new Date(`1970-01-01T${task.end_time}`)
    
      let calculation = end.getTime() - start.getTime()
      if( calculation < 0 ) 
      {
        end = new Date(`1970-01-02T${task.end_time}`)
        calculation = end.getTime() - start.getTime()
      }
      const diffInSeconds = (calculation) / 1000 // Difference in seconds
      totalSeconds += diffInSeconds
    })
  
    // Convert total seconds to HH:MM:SS
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60
  
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }
  
// Calculate task durations
export const calculateTaskDuration = (start, end) => {
    const startTime = new Date(`1970-01-01T${start}Z`)
    let endTime = new Date(`1970-01-01T${end}Z`)

    let duration = endTime.getTime() - startTime.getTime()

    // temp fix for midnight switch
    if(duration < 0)
    {
        endTime = new Date(`1970-01-02T${end}Z`)

        duration = endTime.getTime() - startTime.getTime()
    }
    return (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60)
  }