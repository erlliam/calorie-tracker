addEvents()

function addEvents() {
    let toggleCreateEntry = document.getElementById('toggle-create-entry');
    let createEntryForm = document.getElementById('form-create-entry');
    createEntryForm.addEventListener('submit', handleSubmitEvent);

    onClickToggleHidden(toggleCreateEntry, createEntryForm);

    let toggleCreateFood = document.getElementById('toggle-create-food');
    let createFoodForm = document.getElementById('form-create-food');
    createFoodForm.addEventListener('submit', handleSubmitEvent);

    onClickToggleHidden(toggleCreateFood, createFoodForm);
}

function handleSubmitEvent(e) {
    let form = e.target;
    (async () => {
        let response = await submitForm(form);
        // handle server response
        //form.reset();
    })();
    e.preventDefault();
}

function submitForm(form) {
    let url = form.action;
    let method = form.method;
    let data = getDataFromForm(form);

    let response = fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    return response;
}

function getDataFromForm(form) {
    // requires input elements to have a name attribute
    let data = {};
    Array.from(form.elements).forEach((element) => {
        if (element.tagName === 'INPUT') {
            data[element.name] = element.value;
        }
    });
    return data;
}
/*
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

function onSubmitFoodButtonClicked(e, inputDiv) {
    (async() => {
        let foodName = document.getElementById('createfood-name').value;
        let foodServingSize = document.getElementById('createfood-servingsize').value;
        let foodCalories = document.getElementById('createfood-calories').value;
        let foodFats = document.getElementById('createfood-fats').value;
        let foodCarbs = document.getElementById('createfood-carbs').value;
        let foodProteins = document.getElementById('createfood-proteins').value;
        let url = '/food/add';
        let data = {
            foodName: foodName,
            foodServingSize: foodServingSize,
            foodCalories: foodCalories,
            foodFats: foodFats,
            foodCarbs: foodCarbs,
            foodProteins: foodProteins
        };

        let answer = await submitJsonPostRequest(url, data)

        if (answer.result === 'success') {
            resetAndHideInputDiv(inputDiv);
            flashMessage(answer.reason);
        } else if (answer.result === 'fail') {
            flashMessage(answer.reason);
        }
    })()
}

*/
