document.addEventListener('DOMContentLoaded', () => {
    header = new Header();
});

class Header {
    constructor() {
        this._signUpButton = new ButtonToggleElement(
            'signUpButton',
            'signUpForm'
        );
        this._logInButton = new ButtonToggleElement(
            'logInButton',
            'logInForm'
        );
    }
}

class ButtonToggleElement {
    constructor(buttonId, elementId, hidden=true) {
        this._button = document.getElementById(buttonId);
        this._element = document.getElementById(elementId);
        this._elementHidden = hidden;
        this._button.addEventListener(
            'click',
            () => {this.onButtonClicked()}
        );
    }

    onButtonClicked() {
        this._elementHidden = !this._elementHidden;
        this._element.classList.toggle(
            'hidden',
            this._elementHidden
        );
    }
}
