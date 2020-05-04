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
            if (this._currentResultIndex === this._resultsContainer.children.length - 1) {
                if (!this._reachedEndOfSearch) {
                    let foodResultsPromise = this._fetchFoodResults();
                    foodResultsPromise.then(() => {
                        this._moveForward();
                    });
                }

                // navigate pages if fetch success
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
        return new Promise((resolve, reject) => {
            (async () => {
                let response = await fetch(this._getUrl());
                if (response.status === 200) {
                    let json = await response.json();
                    this._startAtFoodId = json[json.length - 1].food_id;

                    if (json.length < 10) {
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
        // foodArray.forEach((food) => {
        // });
        let div = document.createElement('div');
        div.textContent = 'hi';
        this._resultsContainer.append(div);
    }

    _endSearch() {
        this._reachedEndOfSearch = true;
        console.log('End of search reached');
    }

    _moveForward() {
        console.log('Move forward');
        let currentResultPage = this._getCurrentResultPage();
        this._currentResultIndex += 1
        let newResultPage = this._getCurrentResultPage();

        this._swapPages(currentResultPage, newResultPage);
    }

    _moveBack() {
        console.log('Move backwards');
        let currentResultPage = this._getCurrentResultPage();
        this._currentResultIndex -= 1
        let newResultPage = this._getCurrentResultPage();

        this._swapPages(currentResultPage, newResultPage);
    }

    _getCurrentResultPage() {
        return this._resultsContainer.children[this._currentResultIndex];
    }

    _swapPages(pageToHide, pageToShow) {
        pageToHide.textContent = 'HIDDEN';
        pageToShow.textContent = 'ACTIVE';
    }
}

let myResults = new Results('search-food');

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
