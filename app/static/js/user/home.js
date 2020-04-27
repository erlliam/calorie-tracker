makeForm('search-food');
initPopUpForms();

function initPopUpForms() {
    let createEntryPopUp = makePopUpForm('create-entry');
    let createFoodPopUp = makePopUpForm('create-food');
}

function makeForm(containerId) {
    let container = document.getElementById(containerId);
    let form = container.firstElementChild;

    form.addEventListener('submit', handleSubmitEvent);
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

let handleResponseUrl = {
    '/food/search': foodSearch,
    '/food/add': foodAdd,
    '/diary/add': diaryAdd
}

function foodAdd(response) {
    console.log('FoodAdd');
    if (response.status === 201) {
        console.log('Food created');
    } else if (response.status === 400) {
        console.log('Failed');
    }
}

function foodSearch(response) {
    console.log('FoodSearch');
    if (response.status === 200) {
        response.json().then(json => console.log(json))
    }
}

function diaryAdd(response) {
    console.log('fixbackend');
    console.log('DiaryAdd');
}

function handleSubmitEvent(e) {
    let form = e.target;
    let method = form.method;
    let requestFunction;

    if (method === 'get') {
        requestFunction = formGetRequest;
    } else if (method === 'post') {
        requestFunction = formPostRequest;
    }

    let fetchPromise = requestFunction(form);
    fetchPromise.then((response) => {
        let url = new URL(response.url);
        handleResponseUrl[url.pathname](response);
    });

    e.preventDefault();
}

function formGetRequest(form) {
    let url = new URL(form.action);
    let urlSearchParams = new URLSearchParams(getDataFromForm(form));
    url.search = urlSearchParams;
    // don't know why this works, no documentation...
    // pretty sure URLSearchParams isn't a UVString 
    // url becomes a string i

    let response = fetch(url, {
        method: 'get',
    });

    return response;
}

function formPostRequest(form) {
    let url = new URL(form.action);
    let data = getDataFromForm(form);

    let response = fetch(url, {
        method: 'post',
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
