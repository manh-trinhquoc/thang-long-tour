// hiển thị khách sạn
let xmlhttp2 = new XMLHttpRequest();
let url2 = "json/hotels.json";
let allHotelsData = {};

xmlhttp2.open("GET", url2, true);
xmlhttp2.send();
xmlhttp2.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        allHotelsData = JSON.parse(this.responseText);
        // show hotel detail
        let id = document.location.href.split('=')[1];
        showDetailHotel(allHotelsData[id]);
        // Show các khách sạn khác cùng khu vực
        let visibleHotels = filterConditionArr(allHotelsData, allHotelsData[id]['location-related'], 'location-related');
        // console.log(JSON.stringify(visibleHotels));
        displayHotels(visibleHotels, "filter-hotel", 4, 2);
    }
};

function showDetailHotel(hotelObj) {
    // hiển thị chi tiết bài viết về tour
    // console.log(hotelObj);
    // show name and stars
    let elem = `${hotelObj['name']} 
        <span class="card-hotel__star">${addStars(hotelObj.stars)}</span>`;
    document.getElementById('hotel-title').innerHTML = elem;
    // show address
    elem = `<i class="fas fa-map-marker"></i> ${hotelObj.address}`;
    document.getElementById('hotel-address').innerHTML = elem;
    // show detail
    elem = `<div class="detail__carosel">
                <img class="img-responsive" src="${hotelObj.img[0]}" alt="${hotelObj['name-full']}" />
            </div>`;
    // Tạo request lấy chi tiết về tour trong file html sau đó hiển thị
    let xmlhttp = new XMLHttpRequest();
    let url = hotelObj.link;
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
            if (this.status == 200) { elem += this.responseText; }
            if (this.status == 404) { elem += "Page not found."; }
        }
        document.getElementById('hotel-detail').innerHTML = elem;
    };
    // tạo request lấy map của tour trong file html sau đó hiển thị
    let xmlhttp2 = new XMLHttpRequest();
    let url2 = hotelObj['link-map'];
    xmlhttp2.open("GET", url2, true);
    xmlhttp2.send();
    xmlhttp2.onreadystatechange = function() {
        if (this.readyState == 4) {
            if (this.status == 200) { document.getElementById('hotel-map').innerHTML = this.responseText; }
            if (this.status == 404) { document.getElementById('hotel-map').innerHTML = "Map not found."; }
        }
    };
}

// Hiển thị tour liên quan
let xmlhttp3 = new XMLHttpRequest();
let url3 = "json/tours.json";
xmlhttp3.open("GET", url3, true);
xmlhttp3.send();
xmlhttp3.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        let allToursData = JSON.parse(this.responseText);
        let id = document.location.href.split('=')[1];
        let conditionObj = {
            destination: allHotelsData[id]['location-related'][0]
        }
        // console.log(JSON.stringify(conditionObj))
        visibleTours = filterCondition(allToursData, conditionObj);
        displayTours(visibleTours, undefined, "filter-tour", 4, 2);
    }
};