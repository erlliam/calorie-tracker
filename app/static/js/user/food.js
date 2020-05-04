class Results {
    constructor(containerId) {
        let container = document.getElementById(containerId);
        let children = container.children;

        this._container = container;
        this._resultsContainer = children.results;
        this._form = children.form;
        this._forwardButton = children.forward;
        this._backButton = children.back;

        this._query;
        this._startAtFoodId;
        this._reachedEndOfSearch;
        this._currentResultIndex;

        this._init();
    }

    _init() {
        this._addEventListenersToElements();
    }

    _addEventListenersToElements() {
        this._form.addEventListener('submit', (e) => {
            this._setPropertiesToDefault();

            this._fetchFoodResults();

            e.preventDefault();
        });
        this._forwardButton.addEventListener('click', (e) => {
            if (this._currentResultIndex === this._resultsFetched) {
                if (!this._reachedEndOfSearch) {
                    this._fetchFoodResults();
                }

                // navigate pages if fetch success
            } else {
                this._moveForward();
                // navigate pages
            }
        });

        // implement going back and forth
        // decide on how to show results
        // decide if fetch method will show the results

        this._backButton.addEventListener('click', (e) => {
            if (this._currentResultIndex !== 0) {
                this._moveBack();
            }
        });
    }

    _setPropertiesToDefault() {
        this._query = this._form.children.query.value;
        this._startAtFoodId = 0;
        this._reachedEndOfSearch = false;
        this._currentResultIndex = 0;

        // clear results
    }

    _getUrl() {
        let url = new URL(this._form.action);
        url.search = new URLSearchParams({
            'query': this._query,
            'startAtFoodId': this._startAtFoodId
        });
        return url;
    }

    _fetchFoodResults() {
        // fetching food results implies we want to
        // add these results to the storage
        (async () => {
            let response = await fetch(this._getUrl());
            if (response.status === 200) {
                let json = await response.json();
                this._startAtFoodId = json[json.length - 1].food_id;

                if (json.length < 10) {
                    this._endSearch();
                }

                this._addResults(json);
            } else if (response.status === 204) {
                this._endSearch();
            }
        })();
    }

    _addResults(foodArray) {
        foodArray.forEach((food) => {
            console.log(food);
        });
    }

    _endSearch() {
        this._reachedEndOfSearch = true;
        console.log('End of search reached');
    }
}

let myResults = new Results('search-food');
console.log(myResults);

let container = document.getElementById('search-food');
let children = container.children;

let endOfSearch;
let currentIndex;
let results = children.results;

let form = children.form
form.addEventListener('submit', (e) => {
    // clear results
    while (results.lastChild) {
        results.removeChild(results.lastChild);
    }
    endOfSearch = false;
    currentIndex = 0;

    searchParams = new URLSearchParams({
        'query': form.children.query.value,
        'startAtFoodId': 0
    });

    fetchFoodResults(searchParams);
    e.preventDefault();
});



let url = new URL(form.action);
let resultsPerSearch = 10;
let startAtFoodId;

function fetchFoodResults(searchParams) {
    url.search = searchParams;
    if (!endOfSearch) {
        (async () => {
            let response = await fetch(url);
            if (response.status === 200) {
                let json = await response.json();
                startAtFoodId = json[json.length - 1].food_id;
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


function createFoodResults(foodArray) {
    let resultsPage = document.createElement('div');
    resultsPage.classList.add('result-page');
    foodArray.forEach((food) => {
        let foodContainer = document.createElement('div');
        foodContainer.classList.add('food-result');
        foodContainer.addEventListener('click', (e) => {
            let servingSizePromise = popUpInput('Enter serving amount: ');
            servingSizePromise.then((result) => {
                createFoodEntry(food.food_id, result);
                console.log(result);
            });
        });
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

function createFoodEntry(foodId, grams) {
    let fetchPromise = fetch('/diary/add', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            foodId: foodId,
            grams: grams
        })
    });

    fetchPromise.then((response) => {
        if (response.status === 201) {
            console.log('entry created');
        } else if (response.status === 400) {
            console.log('Error');
        }
    });
}

let header = document.getElementsByTagName('header')[0];

function popUpInput(text) {
    return new Promise((resolve, reject) => {
        let container = document.createElement('div');
        container.classList.add('input-pop');
        let form = document.createElement('form');
        let input = document.createElement('input');
        let button = document.createElement('button');
        button.textContent = 'submit';

        container.append(form);
        form.append(input, button);
        form.addEventListener('submit', (e) => {
            resolve(input.value);
            header.removeChild(container);
            e.preventDefault();
        });

        header.append(container);
    });
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
                'startAtFoodId': startAtFoodId
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
