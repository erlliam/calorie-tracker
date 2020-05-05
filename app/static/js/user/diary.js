makeGetEntries('get-entries');
makePopUpForm('create-entry');

function makeGetEntries(containerId) {
    let container = document.getElementById(containerId);
    let button = container.firstElementChild;
    let div = container.lastElementChild;

    toggleHiddenOnClick(button, div);
    button.addEventListener('click', () => {
        getEntries();
    });
}

function getEntries() {
    let currentTime = new Date();
    let year = currentTime.getFullYear();
    let month = String(currentTime.getMonth() + 1).padStart(2, '0');
    let day = String(currentTime.getDate()).padStart(2, '0');
    let date = `${year}-${month}-${day}`;
    let searchParams = `?date=${date}`;

    (async () => {
        let response = await fetch('/diary/get' + searchParams);
        if (response.status === 200) {
            let json = await response.json()
            displayEntries(json);
            console.log(json);
        } else if (response.status === 400) {
            console.log('Error');
        }
    })();
}

let main = document.getElementsByTagName('main')[0];

function displayEntries(entryArray) {
    let mainContainer = document.createElement('div');
    mainContainer.classList.add('entry-container');
    let totalCaloriesElement = document.createElement('h2');
    mainContainer.append(totalCaloriesElement);
    let totalCalories = 0;
    entryArray.forEach((entry) => {
        totalCalories += entry.calories;

        let entryContainer = document.createElement('div');
        entryContainer.classList.add('entry-item');
        let foodName = document.createElement('h4');
        foodName.textContent = entry.name;
        let caloriesConsumed = document.createElement('h3');
        caloriesConsumed.textContent = entry.calories;
        let fatsConsumed = makeSpan(`Fats consumed: ${entry.fats}`);
        let carbsConsumed = makeSpan(`Carbs consumed: ${entry.carbs}`);
        let proteinsConsumed = makeSpan(`Proteins consumed: ${entry.proteins}`);
        
        entryContainer.append(
            foodName,
            caloriesConsumed,
            fatsConsumed,
            carbsConsumed,
            proteinsConsumed
        );
        mainContainer.append(entryContainer);
    });
    totalCaloriesElement.textContent = totalCalories;

    main.append(mainContainer);
}

function makeSpan(text) {
    let span = document.createElement('span');
    span.textContent = text;
    return span;
}


