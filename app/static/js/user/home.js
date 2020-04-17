class PopUpForm {
    // button makes form pop up
    constructor(parentId) {
        this.div = document.getElementById(containerId);
        // I ought to do query select based on tag?
        // If I don't use the class then I ought to make this a function
        this.button = this.div.children.button;
        this.form = this.div.children.form;

        this.init();
    }

    init() {
        toggleHiddenOnClick(this.button, this.form);
        this.form.addEventListener('submit', handleSubmitEvent);
    }
}

initPopUpForms();

function initPopUpForms() {
    // create-entry or create-entry-container
    let createEntryPopUp = new PopUpForm('create-entry-div');
    let createFoodPopUp = new PopUpForm('create-food-div');
}


function handleSubmitEvent(e) {
    let form = e.target;
    (async () => {
        let response = await submitForm(form);
        // handle server response
        // form.reset();
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
    let data = Object.fromEntries(new FormData(form).entries());

    return data;
}
/*
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
