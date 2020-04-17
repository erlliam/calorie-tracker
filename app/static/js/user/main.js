function toggleHiddenOnClick(elementToClick, elementToToggle) {
    elementToClick.addEventListener('click', (e) => {
        if (e.target == elementToClick) {
            elementToToggle.classList.toggle('hidden');
        }
    });
}
