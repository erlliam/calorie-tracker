makeForm('search-food');
initPopUpForms();

function initPopUpForms() {
    let createEntryPopUp = makePopUpForm('create-entry');
    let createFoodPopUp = makePopUpForm('create-food');
}

function makeForm(containerId) {
    let container = document.getElementById(containerId);
    let form = container.firstElementChild;

    form.addEventListener('submit', handleSubmitEvent);
}

function makePopUpForm(containerId) {
    let container = document.getElementById(containerId);
    // I sort of don't like this... 
    let button = container.firstElementChild;
    let form = container.lastElementChild;

    toggleHiddenOnClick(button, form);
    form.addEventListener('submit', handleSubmitEvent);
}

function quickNotification(text, timeout=2000) {
    let notificationsContainer = document.getElementById(
        'notifications-container');
    let container = document.createElement('div');
    notificationsContainer.insertBefore(
        container,
        notificationsContainer.children[0]);

    let message = document.createElement('span');
    message.textContent = text;
    container.appendChild(message);

    setTimeout(() => {
        container.remove();
    }, timeout);
}

let handleResponseUrl = {
    '/food/search': foodSearch,
    '/food/add': foodAdd,
    '/diary/add': diaryAdd
}

// it's foodcreate..
function foodAdd(response, form) {
    if (response.status === 201) {
        quickNotification('Food created.');

        form.reset();
        // really bad, we assume firstelement is button that shows/hides
        form.parentElement.firstElementChild.click();
    } else if (response.status === 400) {
        quickNotification('Failed');
    }
}

function foodSearch(response, form) {
    if (response.status === 200) {
        response.json().then((json) => {
            quickNotification(`Found ${json.length} results`);
            displayFoods(json);
        });
    }
}

function displayFoods(foods) {
    let foodsContainer = document.createElement('div');
    foodsContainer.classList.add('change-me');

    foods.forEach((food) => {
        let foodContainer = document.createElement('div');

        let foodName = document.createElement('span');
        foodName.textContent = food.name;

        let addToDiaryButton = document.createElement('button');
        addToDiaryButton.textContent = 'Add';
        addToDiaryButton.addEventListener('click', () => {
            addToDiary(food);
        });

        foodContainer.appendChild(foodName);
        foodContainer.appendChild(addToDiaryButton);

        foodsContainer.appendChild(foodContainer);
    });

    let main = document.getElementsByTagName('main')[0];
    main.appendChild(foodsContainer);
}

function addToDiaryButtonClicked(container, food) {
    addToDiary(food);
}

function addToDiary(food) {
    // make a cusotm prompt thingy... sigh
    let serving_size = prompt('Enter serving size');

    let fetchPromise = fetch('/diary/add', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            food_id: food.food_id,
            serving_size: serving_size
        })
    });

    fetchPromise.then((response) => {
        quickNotification(`Added ${food.name} to diary.`);
        console.log(response);
    });
}

function diaryAdd(response) {
    quickNotification('Not done.');
}

function handleSubmitEvent(e) {
    let form = e.target;
    let method = form.method;
    let requestFunction;

    if (method === 'get') {
        requestFunction = formGetRequest;
    } else if (method === 'post') {
        requestFunction = formPostRequest;
    }

    let fetchPromise = requestFunction(form);
    fetchPromise.then((response) => {
        let url = new URL(response.url);
        handleResponseUrl[url.pathname](response, form);
    });

    e.preventDefault();
}

function formGetRequest(form) {
    let url = new URL(form.action);
    let urlSearchParams = new URLSearchParams(getDataFromForm(form));
    url.search = urlSearchParams;

    let response = fetch(url, {
        method: 'get',
    });

    return response;
}

function formPostRequest(form) {
    let url = new URL(form.action);
    let data = getDataFromForm(form);

    let response = fetch(url, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    return response;
}

function getDataFromForm(form) {
    // requires input elements to have a name attribute
    let data = Object.fromEntries(new FormData(form).entries());
    return data;
}
