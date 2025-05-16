// BMI Calculator functionality
document.addEventListener('DOMContentLoaded', function() {
    const weightInput = document.getElementById('weight');
    const heightInput = document.getElementById('height');
    const calculateButton = document.getElementById('calculate-bmi');
    const bmiValueElement = document.getElementById('bmi-value');
    const bmiCategoryElement = document.getElementById('bmi-category');
    const bmiCategorySelect = document.querySelector('select[name="BMI_Category"]');

    // Calculate BMI when the button is clicked
    calculateButton.addEventListener('click', function() {
        const weight = parseFloat(weightInput.value);
        const height = parseFloat(heightInput.value) / 100; // Convert cm to meters

        if (isNaN(weight) || isNaN(height) || weight <= 0 || height <= 0) {
            alert('Please enter valid weight and height values');
            return;
        }

        // Calculate BMI: weight (kg) / (height (m) * height (m))
        const bmi = weight / (height * height);
        const roundedBmi = Math.round(bmi * 10) / 10; // Round to 1 decimal place

        // Display BMI value
        bmiValueElement.textContent = `BMI: ${roundedBmi}`;

        // Determine BMI category
        let category = '';
        let categoryClass = '';
        
        if (bmi < 18.5) {
            category = 'Underweight';
            categoryClass = 'underweight';
        } else if (bmi >= 18.5 && bmi < 25) {
            category = 'Normal';
            categoryClass = 'normal';
        } else if (bmi >= 25 && bmi < 30) {
            category = 'Overweight';
            categoryClass = 'overweight';
        } else {
            category = 'Obese';
            categoryClass = 'obese';
        }

        // Display BMI category
        bmiCategoryElement.textContent = `Category: ${category}`;
        bmiCategoryElement.className = '';
        bmiCategoryElement.classList.add(categoryClass);

        // Auto-select the corresponding option in the BMI Category dropdown
        if (bmiCategorySelect) {
            // Find the option with the matching value
            const options = bmiCategorySelect.options;
            for (let i = 0; i < options.length; i++) {
                if (options[i].text.includes(category)) {
                    bmiCategorySelect.selectedIndex = i;
                    break;
                }
            }
        }
    });
});