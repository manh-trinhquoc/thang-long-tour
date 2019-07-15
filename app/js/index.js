// Tạo request lấy data từ file json sau đó hiển thị
let xmlhttp = new XMLHttpRequest();
let url = "json/tours.json";
xmlhttp.open("GET", url, true);
xmlhttp.send();
xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        let allToursData = JSON.parse(this.responseText);
        // show tour quốc tế
        let visibleTours = filterConditionArr(allToursData, ['international']);
        displayTours(visibleTours, undefined, "filter-international", 4, 3);
        // show tour việt nam
        visibleTours = filterConditionArr(allToursData, ['viet-nam']);
        displayTours(visibleTours, undefined, "filter-vietnam", 4, 3);
        // show tour đã xem gần đây
        visibleTours = getRecentlyViewedTours(allToursData, currentUserObj.historyViewed);
        displayTours(visibleTours, undefined, "filter-history", 4, 2);

    }
};