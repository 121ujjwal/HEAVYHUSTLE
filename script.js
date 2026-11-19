
let workouts = JSON.parse(localStorage.getItem("workouts")) || [];

const workoutForm = document.getElementById("workoutForm");
const exerciseList = document.getElementById("exerciseList");

function displayWorkouts() {
    exerciseList.innerHTML = "";

    workouts.forEach(function(workout) {
        const item = document.createElement("p");
        item.textContent = workout.name + " - " + workout.exercise +
            " | " + workout.sets + " sets x " + workout.reps +
            " reps | " + workout.weight + " kg";
        const deleteBtn = document.createElement("button");
deleteBtn.textContent = "Delete";

deleteBtn.onclick = function() {
    workouts.splice(workouts.indexOf(workout), 1);
    localStorage.setItem("workouts", JSON.stringify(workouts));
    displayWorkouts();
};

item.appendChild(deleteBtn);
exerciseList.appendChild(item);
    });
}

workoutForm.addEventListener("submit", function(event) {
    event.preventDefault();

    workouts.push({
        name: document.getElementById("workoutName").value,
        exercise: document.getElementById("exerciseName").value,
        sets: document.getElementById("sets").value,
        reps: document.getElementById("reps").value,
        weight: document.getElementById("weight").value
    });

    localStorage.setItem("workouts", JSON.stringify(workouts));

    displayWorkouts();
    workoutForm.reset();
});

displayWorkouts();

const foodDatabase = [
    {name: "Rice (cooked)", calories: 130, protein: 2.7, carbs: 28, fats: 0.3},
    {name: "Chicken breast (raw)", calories: 120, protein: 23, carbs: 0, fats: 2.6},
    {name: "Egg", calories: 143, protein: 13, carbs: 1.1, fats: 9.5},
    {name: "Banana", calories: 89, protein: 1.1, carbs: 23, fats: 0.3},
    {name: "Milk", calories: 61, protein: 3.2, carbs: 4.8, fats: 3.3},
    {name: "Paneer", calories: 265, protein: 18, carbs: 1.2, fats: 21},
    {name: "Whey protein powder", calories: 400, protein: 80, carbs: 8, fats: 6},
    {name: "Roti", calories: 297, protein: 9, carbs: 55, fats: 4},
    {name: "Curd", calories: 61, protein: 3.5, carbs: 4.7, fats: 3.3}
];

let foodRecords = JSON.parse(localStorage.getItem("foodRecords")) || [];

const foodForm = document.getElementById("foodForm");
const foodList = document.getElementById("foodList");


function displayFood() {
    foodList.innerHTML = "";

    const today = new Date().toLocaleDateString("en-CA");

    let calories = 0, protein = 0, carbs = 0, fats = 0;

    foodRecords.forEach(function(food, index) {
        if (food.date === today) {
            calories += food.calories;
            protein += food.protein;
            carbs += food.carbs;
            fats += food.fats;

            const item = document.createElement("p");
            item.textContent = food.name + " (" + food.quantity + "g) ";

            const btn = document.createElement("button");
            btn.textContent = "Delete";

            btn.onclick = function() {
                foodRecords.splice(index, 1);
                localStorage.setItem("foodRecords", JSON.stringify(foodRecords));
                displayFood();
                updateDashboard();
            };

            item.appendChild(btn);
            foodList.appendChild(item);
        }
    });

    document.getElementById("totalCalories").textContent = Math.round(calories);
    document.getElementById("totalProtein").textContent = protein.toFixed(1);
    document.getElementById("totalCarbs").textContent = carbs.toFixed(1);
    document.getElementById("totalFats").textContent = fats.toFixed(1);
}


foodForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const name = document.getElementById("foodName").value.trim();
    const quantity = Number(document.getElementById("foodQuantity").value);

    const food = foodDatabase.find(function(item) {
        return item.name.toLowerCase() === name.toLowerCase();
    });

    if (!food || quantity <= 0) {
        alert("Food not found or invalid quantity!");
        return;
    }

    const factor = quantity / 100;

  foodRecords.push({
    name: food.name,
    quantity: quantity,
    calories: food.calories * factor,
    protein: food.protein * factor,
    carbs: food.carbs * factor,
    fats: food.fats * factor,
    date: new Date().toLocaleDateString("en-CA")
});

    localStorage.setItem("foodRecords", JSON.stringify(foodRecords));

    displayFood();
    updateDashboard();
    foodForm.reset();
});

displayFood();

let stepRecords = JSON.parse(localStorage.getItem("stepRecords")) || [];

const stepsForm = document.getElementById("stepsForm");

function displaySteps() {
    const today = new Date().toLocaleDateString("en-CA");
    const record = stepRecords.find(item => item.date === today);

    const steps = record ? record.steps : 0;
    const goal = Number(document.getElementById("stepGoal").value) || 8000;

    document.getElementById("stepsCount").textContent = steps;
    document.getElementById("stepsPercentage").textContent =
        Math.round((steps / goal) * 100);
}

stepsForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const today = new Date().toLocaleDateString("en-CA");
    const steps = Number(document.getElementById("dailySteps").value);
    const goal = Number(document.getElementById("stepGoal").value);

    if (steps < 0 || goal <= 0) {
        alert("Enter valid steps and goal!");
        return;
    }

    stepRecords = stepRecords.filter(item => item.date !== today);

    stepRecords.push({
        date: today,
        steps: steps,
        goal: goal
    });

    localStorage.setItem("stepRecords", JSON.stringify(stepRecords));

    displaySteps();
    updateDashboard();
});

displaySteps();

let sleepRecords = JSON.parse(localStorage.getItem("sleepRecords")) || [];

const sleepForm = document.getElementById("sleepForm");

function displaySleep() {
    const today = new Date().toLocaleDateString("en-CA");
    const record = sleepRecords.find(item => item.date === today);

    document.getElementById("sleepHours").textContent =
        record ? record.hours.toFixed(1) : "0";
}

sleepForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const sleep = document.getElementById("sleepTime").value;
    const wake = document.getElementById("wakeTime").value;

    if (!sleep || !wake || sleep === wake) {
        alert("Enter valid sleep and wake-up times!");
        return;
    }

    let start = new Date("2000-01-01 " + sleep);
    let end = new Date("2000-01-01 " + wake);

    if (end < start) {
        end.setDate(end.getDate() + 1);
    }

    const hours = (end - start) / 3600000;
    const today = new Date().toLocaleDateString("en-CA");

    sleepRecords = sleepRecords.filter(item => item.date !== today);

    sleepRecords.push({
        date: today,
        hours: hours
    });

    localStorage.setItem("sleepRecords", JSON.stringify(sleepRecords));

    displaySleep();
    updateDashboard();
    sleepForm.reset();
});

displaySleep();


let weightRecords = JSON.parse(localStorage.getItem("weightRecords")) || [];

const weightForm = document.getElementById("weightForm");
const weightHistory = document.getElementById("weightHistory");

function displayWeight() {
    weightHistory.innerHTML = "";

    document.getElementById("currentWeight").textContent =
        weightRecords.length > 0
        ? weightRecords[weightRecords.length - 1].weight
        : 0;

    weightRecords.forEach(function(record, index) {
        const item = document.createElement("p");
        item.textContent = record.date + " - " + record.weight + " kg ";

        const btn = document.createElement("button");
        btn.textContent = "Delete";

        btn.onclick = function() {
            weightRecords.splice(index, 1);
            localStorage.setItem("weightRecords", JSON.stringify(weightRecords));
            displayWeight();
            updateDashboard();
        };

        item.appendChild(btn);
        weightHistory.appendChild(item);
    });
}

weightForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const weight = Number(document.getElementById("weightInput").value);

    if (weight <= 0) {
        alert("Enter a valid weight!");
        return;
    }

    weightRecords.push({
        date: new Date().toLocaleDateString(),
        weight: weight
    });

    localStorage.setItem("weightRecords", JSON.stringify(weightRecords));

    displayWeight();
    updateDashboard();
    weightForm.reset();
});

displayWeight();


function updateDashboard() {
    const today = new Date().toLocaleDateString("en-CA");

    const steps = stepRecords.find(item => item.date === today);
    const sleep = sleepRecords.find(item => item.date === today);

    document.getElementById("dashboardSteps").textContent =
        steps ? steps.steps : 0;

   const todayCalories = foodRecords
    .filter(food => food.date === today)
    .reduce((total, food) => total + food.calories, 0);

document.getElementById("dashboardCalories").textContent =
    Math.round(todayCalories) + " kcal";
    document.getElementById("dashboardSleep").textContent =
        sleep ? sleep.hours.toFixed(1) + " hours" : "0 hours";

    document.getElementById("dashboardWeight").textContent =
        weightRecords.length > 0
        ? weightRecords[weightRecords.length - 1].weight + " kg"
        : "0 kg";
}

updateDashboard();

let prRecords = JSON.parse(localStorage.getItem("prRecords")) || [];

const prForm = document.getElementById("prForm");
const prList = document.getElementById("prList");


function displayPR() {

    prList.innerHTML = "";

    prRecords.forEach(function(record, index) {

        const item = document.createElement("p");

        item.textContent = record.exercise +
            " | " + record.weight + " kg" +
            " | " + record.reps + " reps ";

        const btn = document.createElement("button");
        btn.textContent = "Delete";

        btn.onclick = function() {

            prRecords.splice(index, 1);

            localStorage.setItem("prRecords", JSON.stringify(prRecords));

            displayPR();

        };

        item.appendChild(btn);
        prList.appendChild(item);

    });

}

prForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const exercise = document.getElementById("prExercise").value;
    const weight = Number(document.getElementById("prWeight").value);
    const reps = Number(document.getElementById("prReps").value);

    prRecords.push({
        exercise: exercise,
        weight: weight,
        reps: reps
    });

    localStorage.setItem("prRecords", JSON.stringify(prRecords));

    displayPR();

    prForm.reset();

});


displayPR();
