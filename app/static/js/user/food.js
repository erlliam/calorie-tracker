makeForm('search-food', searchFoodResponseHandler);
makePopUpForm('create-food', createFoodResponeHandler);

function searchFoodResponseHandler(form, response) {
    // GET request @ /food/search_count?name=QUERY
    if (response.status === 200) {
        response.text().then((text) => {
            if (text > 0) {
                quickNotification(`Found ${text} results.`)
                let url = new URL(response.url);
                let query = url.searchParams.get('query');
                startPagination(query);
            } else {
                quickNotification(`No results`)
            }
            // quickNotification(`Found ${json.length} results`);
            // display the search results
            // make the results pagination.
            // 10 results at a time.
            // figure out mysql pagination stuffs
            // get total results
            // start pagination basedo n results
        });
    }
}

function startPagination(query) {
    console.log(query);
}

function createFoodResponeHandler(form, response) {
    if (response.status === 201) {
        quickNotification('Food created.');

        form.reset();
        // really bad, we assume firstelement is button that shows/hides
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
