initPopUpForms();

function initPopUpForms() {
    let createEntryPopUp = makePopUpForm('create-entry');
    let createFoodPopUp = makePopUpForm('create-food');
}

function makePopUpForm(containerId) {
    let container = document.getElementById(containerId);
    // I sort of don't like this... 
    let button = container.firstElementChild;
    let form = container.lastElementChild;

    toggleHiddenOnClick(button, form);
    form.addEventListener('submit', handleSubmitEvent);
}
// handle server response
// give user information about what occurerd
// reset form and hide form if successful
function handleSubmitEvent(e) {
    let form = e.target;
    (async () => {
        let response = await submitForm(form);
        if (response.status === 201) {
            // success, resource created
        } else if (response.status === 400) {
            // fail, bad client data
        } else {
            // panic
        }
        console.log(response);
    })();
    e.preventDefault();
}

function submitForm(form) {
    // GET requests can't have a body. This function is 
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
