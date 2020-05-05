const mainContainer = document.getElementsByTagName('main')[0];
const baseUrl = window.location.origin;

class Results {
    constructor(containerId) {
        let container = document.getElementById(containerId);
        let children = container.children;

        // this._container = container;
        this._resultsContainer = children.results;
        this._form = children.form;
        this._forwardButton = children.forward;
        this._backButton = children.back;

        this._query;
        this._startAtFoodId;
        this._resultsPerSearch;
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
            if (this._currentResultIndex === this._resultsContainer.children.length - 1) {
                if (!this._reachedEndOfSearch) {
                    let foodResultsPromise = this._fetchFoodResults();
                    foodResultsPromise.then(() => {
                        this._moveForward();
                    });
                }
            } else {
                this._moveForward();
            }
        });

        this._backButton.addEventListener('click', (e) => {
            if (this._currentResultIndex !== 0) {
                this._moveBack();
            }
        });
    }

    _setPropertiesToDefault() {
        this._query = this._form.children.query.value;
        this._startAtFoodId = 0;
        this._resultsPerSearch = 10;
        this._reachedEndOfSearch = false;
        this._currentResultIndex = 0;

        while (this._resultsContainer.lastChild) {
            this._resultsContainer.removeChild(this._resultsContainer.lastChild);
        }
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
        return new Promise((resolve, reject) => {
            (async () => {
                let response = await fetch(this._getUrl());
                if (response.status === 200) {
                    let json = await response.json();
                    this._startAtFoodId = json[json.length - 1].food_id;

                    if (json.length < this._resultsPerSearch) {
                        this._endSearch();
                    }

                    this._addResults(json);
                    resolve();
                } else if (response.status === 204) {
                    this._endSearch();
                }

            })();
        });
    }

    _addResults(foodArray) {
        let foodPage = document.createElement('div');
        foodPage.classList.add('food-page');

        foodArray.forEach((food) => {
            let container = document.createElement('div');
            container.classList.add('food');
            container.addEventListener('click', (e) => {
                createFoodEntry(food);
            });
            let name = document.createElement('h3');
            name.textContent = food.name;
            let servingSize = document.createElement('h4');
            servingSize.textContent = food.serving_size + 'g';
            let calories = document.createElement('h5');
            calories.textContent = food.calories;


            container.append(
                name,
                servingSize,
                calories,
            );


            foodPage.append(container);
        });

        this._resultsContainer.append(foodPage);
    }

    _endSearch() {
        this._reachedEndOfSearch = true;
        console.log('End of search reached');
    }

    _moveForward() {
        console.log('Move forward');
        this._swapPages(1);
    }

    _moveBack() {
        console.log('Move backwards');
        this._swapPages(-1);
    }

    _getCurrentResultPage() {
        return this._resultsContainer.children[this._currentResultIndex];
    }

    _swapPages(indexChange) {
        let pageToHide = this._getCurrentResultPage();
        this._currentResultIndex += indexChange;
        let pageToShow = this._getCurrentResultPage();

        pageToHide.classList.toggle('hidden', true);
        pageToShow.classList.toggle('hidden', false);
        // false = remove class only
        // true = add class only
    }
}

// Give this 
let myResults = new Results('search-food');

function getServingSizeForFood() {
    let darkenEntirePage = document.createElement('div');
    darkenEntirePage.classList.add('darken-page');

    let form = document.createElement('form');
    form.classList.add('popup-servingsize');

    let label = document.createElement('label');
    label.textContent = "Enter serving size";

    let input = document.createElement('input');
    let submit = document.createElement('button');
    submit.textContent = 'Submit';

    form.append(label, input, submit);
    darkenEntirePage.append(form);
    mainContainer.append(darkenEntirePage);

    return new Promise((resolve) => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            resolve(input.value);
            mainContainer.removeChild(darkenEntirePage);
        });
        darkenEntirePage.addEventListener('click', (e) => {
            if (e.target === darkenEntirePage) {
                resolve('-1');
                mainContainer.removeChild(darkenEntirePage);
            }
        });
    });
}

function createFoodEntry(food) {
    // probably get date from the client
    // lol
    let servingSizePromise = getServingSizeForFood();
    servingSizePromise.then((servingSize) => {
        if (servingSize > 0) {
            let url = new URL('/diary/add', baseUrl);
            let entry = {
                foodId: food.food_id,
                grams: servingSize
            }
            let fetchPromise = fetch(url, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(entry)
            });
            fetchPromise.then((response) => {
                if (response.status === 201) {
                    console.log('Entry created');
                } else if (response.status === 400) {
                    console.log('Entry creation failed');
                }
            });
        } else {
            console.log('Exiting create entry');
        }
    });
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
