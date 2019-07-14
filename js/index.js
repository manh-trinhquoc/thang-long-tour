// Tạo request lấy data từ file json sau đó hiển thị
let xmlhttp = new XMLHttpRequest();
let url = "/thang-long-tour/json/tours.json";
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

function getRecentlyViewedTours(productData, historyViewedArr) {
    // Lọc tour với điều kiện product id nằm trong lịch sử xem tour
    console.group('getRecentlyViewedTours()');

    let newProductData = {};
    for (tourID of historyViewedArr) {
        for (id in productData) {
            if (id == tourID) {
                newProductData[id] = JSON.parse(JSON.stringify(productData[id]));
            }
        }
    }

    console.groupEnd();
    return newProductData;
}