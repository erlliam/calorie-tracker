class HomePage {
    constructor() {
        this._recentFoods = new RecentFoods(5.6);
    }
}

class RecentFoods {
/*
Pagination works on any number of children and columns.
RecentFoods requires:
    element named 'recentFoods'
    any number of children inside 'recentFoods'
    element named 'previousPage'
    element named 'nextPage'
*/
    constructor(entriesPerPage) {
        this._div = document.getElementById('recentFoods');
        // page 0 is equivalent to page 1 on the UI
        this._currentPage = 0;
        this._entriesPerPage = entriesPerPage;
        this._pages = this.getChildren();
        this.initPages();

        this._previousPage = document.getElementById('previousPage');
        this._nextPage = document.getElementById('nextPage');
        this.addEvents();
    }

    getChildren() {
        let children = Array.from(this._div.children);
        let lastPage = Math.ceil(children.length/this._entriesPerPage);
        let pages = [];

        for (let i=0; i<lastPage; i++) {
            pages.push(children.splice(0, this._entriesPerPage));
        }

        return pages;
    }

    addEvents() {
        this._previousPage.addEventListener('click', e => {
            this.previousPage();
        });

        this._nextPage.addEventListener('click', e => {
            this.nextPage();
        });
    }

    initPages() {
        this._pages[0].forEach(e => e.style.display = 'initial');
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
