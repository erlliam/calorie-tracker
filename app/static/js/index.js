function paginate(div, entriesPerPage) {
    let children = Array.from(div.children);
    let lastPage = Math.ceil(children.length/entriesPerPage);
    let pages = [];

    for (let i=0; i<lastPage; i++) {
        pages.push(children.splice(0, entriesPerPage));
    }

    return pages;
}

class RecentFoods {
/*
Pagination works on any number of children
RecentFoods requires:
    element named 'recentFoods'
    any number of children inside 'recentFoods'
    element named 'previousPage'
    element named 'nextPage'
*/
    constructor(startingPage, entriesPerPage) {
        // page 0 is equivalent to page 1 on the UI
        this._div = document.getElementById('recentFoods');
        this._entriesPerPage = entriesPerPage;
        this._pages = paginate(this._div, this._entriesPerPage);
        this._currentPage = startingPage;

        this._previousPage = document.getElementById('previousPage');
        this._nextPage = document.getElementById('nextPage');
    }

    init() {
        this.initPages();
        this.addEventListeners();
    }

    initPages() {
        this._pages[this._currentPage].forEach(e => e.style.display = 'initial');
    }

    addEventListeners() {
        this._previousPage.addEventListener('click', () => {
            this.previousPage();
        });

        this._nextPage.addEventListener('click', () => {
            this.nextPage();
        });
    }

    previousPage() {
        let startingPage = this._currentPage
        if (!(startingPage === 0)) {
            this._currentPage -= 1;
            this.drawPage(startingPage, this._currentPage);
        }
    }

    nextPage() {
        let startingPage = this._currentPage
        if (!(startingPage === this._pages.length-1)) {
            this._currentPage += 1;
            this.drawPage(startingPage, this._currentPage);
        }
    }

    drawPage(previousPage, currentPage) {
        this._pages[previousPage].forEach(e => e.style.display = 'none');
        this._pages[currentPage].forEach(e => e.style.display = 'initial');
    }
}

let recentFoods = new RecentFoods(0, 4)
recentFoods.init()
