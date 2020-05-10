let base = window.location.origin
let href = window.location.href;

getDaysWithEntries();
makeGetEntries('get-entries');
makePopUpForm('create-entry');

function getDaysWithEntries() {
    (async() => {
        let response = await fetch(href + 'summary');
        if (response.status === 200) {
            let json = await response.json();
            console.log(json);
        }
    })();
}

function makeGetEntries(containerId) {
    let container = document.getElementById(containerId);
    let button = container.firstElementChild;
    let div = container.lastElementChild;

    toggleHiddenOnClick(button, div);
    button.addEventListener('click', () => {
        let entries = new FoodEntries();
        console.log(entries._entries);
    });
}
function getEntries(date) {
    let url = new URL(base + '/diary/get');
    url.search = `?date=${date}`;
    return new Promise((resolve) => {
        (async() => {
            let response = await fetch(url);
            if (response.status === 200) {
                let json = await response.json();
                resolve(json);
            } else {
                resolve({});
            }
        })();
    });
}

class FoodEntries {
    constructor(date) {
        this._date = date;

        this._init();
    }

    _init() {
        this._fetchEntries().then((entries) => {
            this._entries = entries;
            console.log(this);
        });
    }

    _fetchEntries() {
        let date = getFormattedDate(this._date);
        let url = new URL(base + '/diary/get');
        url.search = `?date=${date}`;

        return new Promise((resolve) => {
            (async() => {
                let response = await fetch(url);
                if (response.status === 200) {
                    let json = await response.json();
                    resolve(json);
                } else {
                    resolve({});
                }
            })();
        });
    }
}

// Year-Month-Date
// 2000-12-14

function getFormattedDate(date) {
    // date is a Date object.
    let year = date.getFullYear();
    let month = String(date.getMonth() + 1).padStart(2, '0');
    let day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function getDateFromDaysBefore(days) {
    let date = new Date();
    date.setDate(date.getDate() - days);

    return date;
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
