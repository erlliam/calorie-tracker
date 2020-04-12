addEventsToPageButtons();

function flashMessage(text) {
    let messageDiv = document.createElement('div');
    let messageText = document.createElement('span');
    let deleteMessageButton = document.createElement('button');
    let mainElement = document.getElementsByTagName('main')[0];

    messageText.textContent = text;
    deleteMessageButton.textContent = 'DELETE';

    deleteMessageButton.addEventListener('click', (e) => {
        messageDiv.remove();
    });

    messageDiv.appendChild(messageText);
    messageDiv.appendChild(deleteMessageButton);

    document.body.insertBefore(messageDiv, mainElement);
}

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
    (async() => {
        let foodId = document.getElementById('createentry-id').value;
        let foodServingSize = document.getElementById('createentry-servingsize').value;
        let url = '/diary/add';
        let data = {
            foodId: foodId,
            foodServingSize: foodServingSize
        };

        let answer = await submitJsonPostRequest(url, data)

        if (answer.result === 'success') {
            resetAndHideInputDiv(inputDiv);
            flashMessage(answer.reason);
        } else if (answer.result === 'fail') {
            flashMessage(answer.reason);
            // give feedback that it wasnt usccessful
        }

    })()
}

function onSubmitFoodButtonClicked(e, inputDiv) {
    (async() => {
        let foodName = document.getElementById('createfood-name').value;
        let foodServingSize = document.getElementById('createfood-servingsize').value;
        let foodCalories = document.getElementById('createfood-calories').value;
        let url = '/food/add';
        let data = {
            foodName: foodName,
            foodServingSize: foodServingSize,
            foodCalories: foodCalories
        };

        let answer = await submitJsonPostRequest(url, data)

        if (answer.result === 'success') {
            resetAndHideInputDiv(inputDiv);
            flashMessage(answer.reason);
        } else if (answer.result === 'fail') {
            flashMessage(answer.reason);
            // give feedback that it wasnt usccessful
        }

    })()
}

async function submitJsonPostRequest(url, data) {
    let response = await fetch(url, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    });

    if (response.ok) {
        return await response.json();
    } else {
        return {
            result: 'fail',
            reason: 'response code not ok'
        };
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
