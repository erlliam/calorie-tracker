let container = document.getElementById('search-food');
let children = container.children;

let endOfSearch;
let currentIndex;

let form = children.form
form.addEventListener('submit', (e) => {
    endOfSearch = false;
    currentIndex = 0;

    searchParams = new URLSearchParams({
        'query': form.children.query.value,
        'lastValue': 0
    });

    fetchFoodResults(searchParams);
    e.preventDefault();
});

let url = new URL(form.action);
let resultsPerSearch = 10;
let lastFoodId;

function fetchFoodResults(searchParams) {
    url.search = searchParams;
    if (!endOfSearch) {
        (async () => {
            let response = await fetch(url);
            if (response.status === 200) {
                let json = await response.json();
                lastFoodId = json[json.length - 1].food_id;
                createFoodResults(json);
                if (json.length < resultsPerSearch) {
                    endOfSearch = true;
                    console.log('No more results');
                }
            } else if (response.status === 204) {
                endOfSearch = true;
                console.log('No results');
            }
        })();
    }
}

let results = children.results;

function createFoodResults(foodArray) {
    let resultsPage = document.createElement('div');
    resultsPage.classList.add('result-page');
    foodArray.forEach((food) => {
        let foodContainer = document.createElement('div');
        foodContainer.classList.add('food-result');
        foodContainer.append(
            createPWithText(food.name),
            createPWithText(`Per ${food.serving_size} grams`),
            createPWithText('Calories:'),
            createSpanWithText(`Fats: ${food.fats}`),
            createSpanWithText(`Carbs: ${food.carbs}`),
            createSpanWithText(`Proteins: ${food.proteins}`)
        )
        resultsPage.append(foodContainer);
    });
    results.append(resultsPage);
}

function hideFoodResults(index) {
    results.children[index].style.display = 'none';
}

function showFoodResults(index) {
    results.children[index].style.removeProperty('display');
}

let forward = children.forward;
forward.addEventListener('click', (e) => {
    if (currentIndex === results.children.length - 1) {
        if (endOfSearch) {
            console.log('No more results to show');
        } else {
            hideFoodResults(currentIndex);
            currentIndex += 1;
            let searchParams = new URLSearchParams({
                'query': form.children.query.value,
                'lastValue': lastFoodId
            });
            fetchFoodResults(searchParams);
            // calls its own form of showFoodResults
            // very magic
        }
    } else {
        hideFoodResults(currentIndex);
        currentIndex += 1;
        showFoodResults(currentIndex);
    }
});

let back = children.back;
back.addEventListener('click', (e) => {
    if (currentIndex !== 0) {
        hideFoodResults(currentIndex);
        currentIndex -= 1;
        showFoodResults(currentIndex);
    } else {
        console.log('No results to go back to');
    }
});

function createPWithText(text) {
    let p = document.createElement('p');
    p.textContent = text;
    return p;
}

function createSpanWithText(text) {
    let span = document.createElement('span');
    span.textContent = text;
    return span;
}


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
