let container = document.getElementById('search-food');
let children = container.children;
let form = children.form
let resultsContainer = children.results;
let back = children.back;
let forward = children.forward;

let url = new URL(form.action);

let results;
let currentIndex;
let finalIndex;

form.addEventListener('submit', (e) => {
    url.search = new URLSearchParams({
        'query': form.children.query.value,
        'lastValue': 0
    });

    (async () => {
        let response = await fetch(url);
        let json = await response.json();
        if (JSON.stringify(json) !== '{}') {
            results = [json];
            currentIndex = 0;
            if (json.length < 10) {
                finalIndex = currentIndex;
            }
        } else {
            console.log('No results');
            currentIndex = 0;
            finalIndex = 0;
        }
    })();

    e.preventDefault();
});

forward.addEventListener('click', (e) => {
    if (currentIndex !== finalIndex) {
        if (currentIndex === results.length - 1) {
            let lastResult = getLastElement(results);
            let lastFoodId = getLastElement(lastResult).food_id;

            let searchParams = url.searchParams;
            searchParams.set('lastValue', lastFoodId);
            url.search = searchParams;
            (async () => {
                let response = await fetch(url);
                let json = await response.json();

                if (json.length !== 0) {
                    results.push(json);
                    currentIndex += 1;
                }
                if (json.length < 10) {
                    finalIndex = currentIndex;
                }
            })();
        } else {
            currentIndex += 1;
        }
    } else {
        console.log('No more results');
    }
});

back.addEventListener('click', (e) => {
    if (currentIndex !== 0) {
        currentIndex -= 1;
    } else {
        console.log('At start of serach');
    }
});

function getLastElement(array) {
    return array[array.length - 1];
}



// quickNotification(`Found ${json.length} results`);
// display the search results
// make the results pagination.
// 10 results at a time.
// figure out mysql pagination stuffs
// get total results
// start pagination basedo n results

makePopUpForm('create-food', createFoodResponeHandler);

function createFoodResponeHandler(form, response) {
    if (response.status === 201) {
        quickNotification('Food created.');
        form.reset();
        form.parentElement.firstElementChild.click();
    } else if (response.status === 400) {
        quickNotification('Failed');
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
    // let serving_size = popUpInput('Enter serving size');

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
