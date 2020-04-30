function toggleHiddenOnClick(elementToClick, elementToToggle) {
    elementToClick.addEventListener('click', (e) => {
        if (e.target == elementToClick) {
            elementToToggle.classList.toggle('hidden');
        }
    });
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

function quickNotification(text, timeout=2000) {
    let notificationsContainer = document.getElementById(
        'notifications-container');
    let container = document.createElement('div');
    notificationsContainer.insertBefore(
        container,
        notificationsContainer.children[0]);

    let message = document.createElement('span');
    message.textContent = text;
    container.appendChild(message);

    setTimeout(() => {
        container.remove();
    }, timeout);
}

function formGetRequest(form) {
    let url = new URL(form.action);
    let urlSearchParams = new URLSearchParams(getDataFromForm(form));
    url.search = urlSearchParams;

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
