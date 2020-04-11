addEventsToPageButtons();
function addEventsToPageButtons() {
    // food entry refers to diary, food refers to making a food in the database
    let openFoodEntryButton = document.getElementById('createentry-open');
    let addFoodEntryInput = document.getElementById('createentry-input');
    onClickToggleHidden(openFoodEntryButton, addFoodEntryInput);
    console.log(openFoodEntryButton);
    let submitFoodEntryButton = document.getElementById('createentry-submit');
    submitFoodEntryButton.addEventListener('click', (e) => {
        onSubmitFoodEntryButtonClicked(e, addFoodEntryInput);
    });


    let openFoodButton = document.getElementById('createfood-open');
    let addFoodInput = document.getElementById('createfood-input');
    onClickToggleHidden(openFoodButton, addFoodInput);
    let submitFoodButton = document.getElementById('createfood-submit');
    submitFoodButton.addEventListener('click', (e) => {
        onSubmitFoodButtonClicked();
        // reset input fields, call post requests
    });

    let openFoodByImageButton = document.getElementById('createfoodphoto-open');
}

function onSubmitFoodEntryButtonClicked(e, inputDiv) {
    // call post request to the back end
    // if successly does shit to database, we update the front end
    // ought to check the event target just incase there is some bubbling crap

    // reset input values and hide the input div!, could be function
    resetInputDivAndHide(inputDiv);
}

function addEventsToInputDivChildren() {
    // press enter, go to next input field, if at final field
    // simulate a click on the submit button...
}

function resetInputDivAndHide(inputDiv) {
    inputDiv.classList.toggle('hidden');

    let inputDivChildren = inputDiv.children
    let inputDivChildrenArray = Array.from(inputDivChildren);
    inputDivChildrenArray.forEach((child) => {
        child.value = '';
    });
}


function addFoodToDatabase() {
    let foodName = document.getElementById('createfood-input');
    let foodServingSize = document.getElementById('createfood-servingsize');
    let foodCalories = document.getElementById('createfood-calories');

    data = {
        foodName: foodName,
        foodServingSize: foodServingSize,
        foodCalories: foodCalories
    };

    let response = fetch('/food/add', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    });
}

function addEntryToDatabase() {
    let foodId = document.getElementById('createentry-foodid');
    let foodServingSize = document.getElementById('createentry-servingsize');

    data = {
        foodId: foodId,
        foodServingSize: foodServingSize
    };

    let response = fetch('/diary/add', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    });
}

