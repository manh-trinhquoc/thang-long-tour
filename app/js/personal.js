let checkPersonalPageInitFinished = new Promise(function(resolve, reject) {
    let timer = setInterval(function() {
        if (currentUserObj.isAppInitialized) {
            clearInterval(timer);
            resolve();
        }
    }, 500);
});

let tourPromise = new Promise(function(resolve, reject) {
    // lấy data về tour trong json
    let xmlhttp = new XMLHttpRequest();
    let url = "json/tours.json";

    xmlhttp.open("GET", url, true);
    xmlhttp.send();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let allToursData = JSON.parse(this.responseText);
            resolve(allToursData);

        }
    };
});

tourPromise.then(function(resolve) {
    // show tour đã xem gần đây
    let allToursData = resolve;
    visibleTours = getRecentlyViewedTours(allToursData, currentUserObj.historyViewed);
    displayTours(visibleTours, undefined, "filter-history", 4, 2);
});