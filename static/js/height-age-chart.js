// Height-Age Chart Implementation
document.addEventListener('DOMContentLoaded', function() {
    // Data for average height ranges by age and gender (based on medical references)
    const heightData = {
        male: {
            // Age ranges as shown in the chart
            ageLabels: ['18-20', '21-30', '31-40', '41-50', '51-60', '61-65'],
            // Average heights for males by age range
            avgHeight: [177, 176, 175, 174, 173, 172],
            // Height ranges for males
            heightMin: [168, 167, 166, 165, 164, 163],
            heightMax: [188, 187, 186, 185, 184, 183]
        },
        female: {
            // Age ranges as shown in the chart
            ageLabels: ['18-20', '21-30', '31-40', '41-50', '51-60', '61-65'],
            // Average heights for females by age range
            avgHeight: [163, 162, 161, 160, 159, 158],
            // Height ranges for females
            heightMin: [153, 152, 151, 150, 149, 148],
            heightMax: [173, 172, 171, 170, 169, 168]
        }
    };

    // Create the chart when height input changes
    const heightInput = document.getElementById('height');
    const ageInput = document.querySelector('input[name="Age"]');
    
    function updateHeightAgeChart() {
        const height = parseFloat(heightInput.value);
        const age = parseInt(ageInput.value);

        if (!isNaN(height) && !isNaN(age)) {
            renderHeightAgeChart(height, age);
        } else {
            // Initialize with default values if inputs are empty
            renderHeightAgeChart(170, 30);
        }
    }

    // Initialize chart when page loads
    renderHeightAgeChart(170, 30);

    // Update chart when inputs change
    heightInput.addEventListener('input', updateHeightAgeChart);
    ageInput.addEventListener('input', updateHeightAgeChart);

    function renderHeightAgeChart(currentHeight, currentAge) {
        const ctx = document.getElementById('height-age-chart').getContext('2d');
        
        // Destroy existing chart if it exists
        if (window.heightAgeChart instanceof Chart) {
            window.heightAgeChart.destroy();
        }

        // Determine which age group the current age falls into
        let ageIndex = 0;
        if (currentAge > 20 && currentAge <= 30) ageIndex = 1;
        else if (currentAge > 30 && currentAge <= 40) ageIndex = 2;
        else if (currentAge > 40 && currentAge <= 50) ageIndex = 3;
        else if (currentAge > 50 && currentAge <= 60) ageIndex = 4;
        else if (currentAge > 60 && currentAge <= 65) ageIndex = 5;

        window.heightAgeChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: heightData.male.ageLabels,
                datasets: [
                    {
                        label: 'Male Average Height (cm)',
                        data: heightData.male.avgHeight,
                        borderColor: 'rgba(54, 162, 235, 1)',
                        backgroundColor: 'transparent',
                        borderWidth: 3,
                        pointBackgroundColor: 'rgba(54, 162, 235, 1)',
                        pointRadius: 5,
                        pointHoverRadius: 7,
                        tension: 0.3,
                        fill: false,
                        order: 1
                    },
                    {
                        label: 'Male Height Range',
                        data: heightData.male.heightMax,
                        borderColor: 'rgba(54, 162, 235, 0.7)',
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        borderWidth: 1,
                        pointRadius: 0,
                        fill: '+1',
                        tension: 0.3
                    },
                    {
                        label: 'Male Height Range',
                        data: heightData.male.heightMin,
                        borderColor: 'rgba(54, 162, 235, 0.7)',
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        borderWidth: 1,
                        pointRadius: 0,
                        fill: false,
                        tension: 0.3
                    },
                    {
                        label: 'Female Average Height (cm)',
                        data: heightData.female.avgHeight,
                        borderColor: 'rgba(255, 99, 132, 1)',
                        backgroundColor: 'transparent',
                        borderWidth: 3,
                        pointBackgroundColor: 'rgba(255, 99, 132, 1)',
                        pointRadius: 5,
                        pointHoverRadius: 7,
                        tension: 0.3,
                        fill: false,
                        order: 1
                    },
                    {
                        label: 'Female Height Range',
                        data: heightData.female.heightMax,
                        borderColor: 'rgba(255, 99, 132, 0.7)',
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        borderWidth: 1,
                        pointRadius: 0,
                        fill: '+1',
                        tension: 0.3
                    },
                    {
                        label: 'Female Height Range',
                        data: heightData.female.heightMin,
                        borderColor: 'rgba(255, 99, 132, 0.7)',
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        borderWidth: 1,
                        pointRadius: 0,
                        fill: false,
                        tension: 0.3
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Height by Age Reference Chart',
                        color: 'white',
                        font: {
                            size: 24,
                            weight: 'bold',
                            family: 'Arial, sans-serif'
                        },
                        padding: 20
                    },
                    legend: {
                        position: 'top',
                        align: 'start',
                        labels: {
                            color: 'white',
                            usePointStyle: true,
                            padding: 15,
                            font: {
                                size: 12
                            },
                            filter: function(item) {
                                // Only show the main legend items
                                return item.text.includes('Average Height');
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleFont: {
                            size: 14,
                            weight: 'bold'
                        },
                        bodyFont: {
                            size: 13
                        },
                        padding: 12,
                        displayColors: true,
                        callbacks: {
                            title: function(tooltipItems) {
                                return 'Age Range: ' + tooltipItems[0].label;
                            },
                            label: function(context) {
                                const label = context.dataset.label || '';
                                const value = context.raw || 0;
                                return label + ': ' + value + ' cm';
                            },
                            afterLabel: function(context) {
                                if (context.dataset.label === 'Your Current Height') {
                                    const maleAvg = heightData.male.avgHeight[context.dataIndex];
                                    const femaleAvg = heightData.female.avgHeight[context.dataIndex];
                                    const diff = context.raw - maleAvg;
                                    const diffF = context.raw - femaleAvg;
                                    
                                    let messages = [];
                                    
                                    if (context.raw > maleAvg) {
                                        messages.push('You are ' + Math.abs(diff).toFixed(1) + ' cm taller than average male');
                                    } else if (context.raw < maleAvg) {
                                        messages.push('You are ' + Math.abs(diff).toFixed(1) + ' cm shorter than average male');
                                    } else {
                                        messages.push('You are exactly average male height');
                                    }
                                    
                                    if (context.raw > femaleAvg) {
                                        messages.push('You are ' + Math.abs(diffF).toFixed(1) + ' cm taller than average female');
                                    } else if (context.raw < femaleAvg) {
                                        messages.push('You are ' + Math.abs(diffF).toFixed(1) + ' cm shorter than average female');
                                    } else {
                                        messages.push('You are exactly average female height');
                                    }
                                    
                                    return messages;
                                }
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Age Range (years)',
                            color: 'white',
                            font: {
                                size: 14,
                                weight: 'bold'
                            },
                            padding: {top: 10, bottom: 0}
                        },
                        ticks: {
                            color: 'white',
                            font: {
                                size: 12
                            }
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)',
                            drawBorder: false
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Height (cm)',
                            color: 'white',
                            font: {
                                size: 14,
                                weight: 'bold'
                            },
                            padding: {top: 0, bottom: 0}
                        },
                        min: 145,
                        max: 195,
                        ticks: {
                            color: 'white',
                            font: {
                                size: 12
                            },
                            stepSize: 5
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)',
                            drawBorder: false
                        }
                    }
                }
            }
        });

        // Add a horizontal line for the current height
        const yourHeightLine = {
            label: 'Your Current Height',
            data: Array(heightData.male.ageLabels.length).fill(currentHeight),
            borderColor: 'rgba(255, 215, 0, 1)',
            borderWidth: 3,
            borderDash: [6, 4],
            pointRadius: 0,
            pointHoverRadius: 0,
            fill: false,
            order: 0
        };
        window.heightAgeChart.data.datasets.push(yourHeightLine);
        window.heightAgeChart.update();
    }
});