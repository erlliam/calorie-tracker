addEventsToPageButtons();

function addEventsToPageButtons() {
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
        onSubmitFoodButtonClicked(e, addFoodInput);
    });
    // let openFoodByImageButton = document.getElementById('createfoodphoto-open');
}

function onSubmitFoodEntryButtonClicked(e, inputDiv) {
    let response = addEntryToDatabase();
    // call post request to the back end
    // if successly does shit to database, we update the front end
    // ought to check the event target just incase there is some bubbling crap

    // reset input values and hide the input div!, could be function
    resetAndHideInputDiv(inputDiv);
}

function addEntryToDatabase() {
    let foodId = document.getElementById('createentry-foodid').value;
    let foodServingSize = document.getElementById('createentry-servingsize').value;

    // check if this crap above is valid

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


function onSubmitFoodButtonClicked(e, inputDiv) {
    (async() => {
        let result = await addFoodToDatabase()
        if (result === 'success') {
            resetAndHideInputDiv(inputDiv);
            console.log('hii');
        } else if (result === 'failed') {
            console.log('error');
        }
    })()
}

async function addFoodToDatabase() {
    let foodName = document.getElementById('createfood-name').value;
    let foodServingSize = document.getElementById('createfood-servingsize').value;
    let foodCalories = document.getElementById('createfood-calories').value;

    data = {
        foodName: foodName,
        foodServingSize: foodServingSize,
        foodCalories: foodCalories
    };

    let response = await fetch('/food/add', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    });
    
    if (response.ok) {
        let text = await response.text()
        return text
    }
}

function addEventsToInputDivChildren() {
    // this function ought to add
    // press enter, go to next input field, if at final field
    // simulate a click on the submit button...
}

function resetAndHideInputDiv(inputDiv) {
    inputDiv.classList.toggle('hidden');

    let inputDivChildren = inputDiv.children
    let inputDivChildrenArray = Array.from(inputDivChildren);
    inputDivChildrenArray.forEach((child) => {
        child.value = '';
    });
}
