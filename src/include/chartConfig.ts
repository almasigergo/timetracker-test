export const data = {
    labels: ['Title'],
    datasets: [
      {
        backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#DD1B16'],
        data: [1]
      }
    ]
  }
  
  export const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
        legend: {
            display: false
        },
        tooltip: {
          callbacks: {
            // Custom tooltip label
            label: function (tooltipItem) {
              const dataset = tooltipItem.dataset
              const dataValue = dataset.data[tooltipItem.dataIndex]
              const hours = Math.floor(dataValue) // Get the integer part
              return `${hours}`
            },
          },
        },
      },
  }

  export const optionsHours = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
        legend: {
            display: false
        },
        tooltip: {
          callbacks: {
            // Custom tooltip label
            label: function (tooltipItem) {
              const dataset = tooltipItem.dataset
              const dataValue = dataset.data[tooltipItem.dataIndex]
              const hours = Math.floor(dataValue) // Get the integer part
              const minutes = Math.round((dataValue - hours) * 60) // Convert decimal to minutes
              const label = tooltipItem.label || 'Unknown'
              return `${hours}h ${minutes}m`
            },
          },
        },
      },
  }