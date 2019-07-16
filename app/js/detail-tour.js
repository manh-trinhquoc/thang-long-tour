// Thêm data vào lịch sử nếu ko phải là reload trang
console.log('Thêm lịch sử xem tour');
let tourID = window.location.href.split("=")[1];
let lastID = currentUserObj.historyViewed[0]
if (tourID != lastID) {
    // nếu trước đó đã có id này thì xóa id ở vị trí cũ
    let index = currentUserObj.historyViewed.findIndex(function(currentValue) {
        return currentValue == tourID;
    });
    if (index >= 0) currentUserObj.historyViewed.splice(index, 1);
    // thêm id mới
    currentUserObj.historyViewed.unshift(tourID);
    for (; currentUserObj.historyViewed.length > 8;) {
        currentUserObj.historyViewed.pop();
    }
    localStorage.setItem('historyViewed', JSON.stringify(currentUserObj.historyViewed));
    console.group('add tourID to historyViewed');
    console.log(JSON.stringify(currentUserObj.historyViewed));
    console.groupEnd();
}

// Tạo request lấy data từ file json sau đó hiển thị
let xmlhttp = new XMLHttpRequest();
let url = "json/tours.json";
xmlhttp.open("GET", url, true);
xmlhttp.send();
xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        let allToursData = JSON.parse(this.responseText);
        // show tour detail
        let id = document.location.href.split('=')[1];
        showBookInfo(allToursData[id]);
        showDetailTour(allToursData[id]);
        // show tour tương tự
        visibleTours = getSimilar(allToursData, id);
        displayTours(visibleTours, undefined, "filter-similar-tour", 4, 2);
        // show tour đã xem gần đây
        visibleTours = getRecentlyViewedTours(allToursData, currentUserObj.historyViewed);
        displayTours(visibleTours, undefined, "filter-history", 4, 2);
    }
};

function showDetailTour(tourObj) {
    // hiển thị chi tiết bài viết về tour
    let elem = `<div class="detail__carosel">
                    <img class="img-responsive" src="${tourObj.img[0]}" alt="${tourObj['name-full']}" />
                </div>`;
    // Tạo request lấy chi tiết về tour trong file html sau đó hiển thị
    let xmlhttp = new XMLHttpRequest();
    let url = tourObj.link;
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
            if (this.status == 200) { elem += this.responseText; }
            if (this.status == 404) { elem += "Page not found."; }
        }
        document.getElementById('tour-detail').innerHTML = elem;
    };
    // tạo request lấy map của tour trong file html sau đó hiển thị
    let xmlhttp2 = new XMLHttpRequest();
    let url2 = tourObj['link-map'];
    xmlhttp2.open("GET", url2, true);
    xmlhttp2.send();
    xmlhttp2.onreadystatechange = function() {
        if (this.readyState == 4) {
            if (this.status == 200) { document.getElementById('tour-map').innerHTML = this.responseText; }
            if (this.status == 404) { document.getElementById('tour-map').innerHTML = "Map not found."; }
        }
    };
}

function showBookInfo(tourObj) {
    let elem = `<h2 class="title">Thời gian</h2>
                    <p>${tourObj.day} ngày ${tourObj.night} đêm</p>
                    <h2>Giá</h2>
                    <p>${tourObj.price}</p>
                    <h2>Ngày khởi hành</h2>
                    <p>${tourObj['departure-date']}</p>`

    document.getElementById('book-info').innerHTML = elem;
    document.getElementById('tour-title').innerText = tourObj['name-full'];
}