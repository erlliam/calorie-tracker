document.addEventListener('DOMContentLoaded', () => {
    addHeaderButtonEvents();
});

function addHeaderButtonEvents() {
    let signUpButton = document.getElementById('signup-button');
    let signUpDiv = document.getElementById('signup-div');
    onClickToggleHidden(signUpButton, signUpDiv);
    onClickToggleHidden(signUpDiv, signUpDiv);

    let logInButton = document.getElementById('login-button');
    let logInDiv = document.getElementById('login-div');
    onClickToggleHidden(logInButton, logInDiv);
    onClickToggleHidden(logInDiv, logInDiv);
}

function onClickToggleHidden(elementToClick, elementToToggle) {
    elementToClick.addEventListener('click', (e) => {
        if (e.target == elementToClick) {
            elementToToggle.classList.toggle('hidden');
        }
    });
}
