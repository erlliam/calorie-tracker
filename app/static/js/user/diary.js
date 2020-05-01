makeGetEntries('get-entries');
makePopUpForm('create-entry');

function makeGetEntries(containerId) {
    let container = document.getElementById(containerId);
    let button = container.firstElementChild;
    let div = container.lastElementChild;

    toggleHiddenOnClick(button, div);
    button.addEventListener('click', () => {
        getEntries();
    });
}

function getEntries() {
    let fetchPromise = fetch('/diary/get', {
        method: 'get',
        headers: {
            'Content-Type': 'application/json'
        },
    });

    (async () => {
        let response = await fetchPromise;
        let json = await response.json()
        console.log(json);
    })();
}
