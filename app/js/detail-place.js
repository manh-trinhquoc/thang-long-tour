let placePromise = new Promise(function(resolve, reject) {
    // hiển thị địa điểm
    let xmlhttp = new XMLHttpRequest();
    let url = "json/places.json";

    xmlhttp.open("GET", url, true);
    xmlhttp.send();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let allPlacesData = JSON.parse(this.responseText);
            resolve(allPlacesData);
        }
    };
});

placePromise.then(function(resolve) {
    // console.log('resolve');
    // console.log(resolve);
    let allPlacesData = resolve;
    // show place detail
    let id = document.location.href.split('=')[1];
    showDetailPlace(allPlacesData[id]);
    // Show các địa danh khác
    let visiblePlaces = getSimilar(allPlacesData, id);
    displayPlaces(visiblePlaces, "place-result", 4, 2);
});



function showDetailPlace(placeObj) {
    // hiển thị chi tiết bài viết về tour
    document.getElementById('place-title').innerText = placeObj['name-full'];
    let elem = `<div class="detail__carosel">
                    <img class="img-responsive" src="${placeObj.img[0]}" alt="${placeObj['name-full']}" />
                </div>`;
    // Tạo request lấy chi tiết về địa điểm trong file html sau đó hiển thị
    let xmlhttp = new XMLHttpRequest();
    let url = placeObj.link;
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
            if (this.status == 200) { elem += this.responseText; }
            if (this.status == 404) { elem += "Page not found."; }
        }
        document.getElementById('place-detail').innerHTML = elem;
    };
    // tạo request lấy map của tour trong file html sau đó hiển thị
    let xmlhttp2 = new XMLHttpRequest();
    let url2 = placeObj['link-map'];
    xmlhttp2.open("GET", url2, true);
    xmlhttp2.send();
    xmlhttp2.onreadystatechange = function() {
        if (this.readyState == 4) {
            if (this.status == 200) { document.getElementById('place-map').innerHTML = this.responseText; }
            if (this.status == 404) { document.getElementById('place-map').innerHTML = "Map not found."; }
        }
    };
}

// Hiển thị blog du lịch
let xmlhttp = new XMLHttpRequest();
let url = "json/blogs.json";

xmlhttp.open("GET", url, true);
xmlhttp.send();
xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        let allBlogsData = JSON.parse(this.responseText);
        let id = document.location.href.split('=')[1].replace(/[pP]/, 'B');
        // Do có nhiều place hơn blog nên giới hạn giá trị id
        if (id > 'B010') id = 'B010';
        let visibleBlogs = getSimilar(allBlogsData, id);
        displayBlogs(visibleBlogs, "blog-result", 4, 2);
    }
};


let tourPromise = new Promise(function(resolve, reject) {
    // Hiển thị tour liên quan
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

Promise.all([placePromise, tourPromise]).then(function(resolve) {
    let [allPlacesData, allToursData] = resolve;
    let id = document.location.href.split('=')[1];
    let conditionObj = {
        destination: allPlacesData[id]['location-related'][0]
    }
    // console.log(JSON.stringify(conditionObj))
    visibleTours = filterCondition(allToursData, conditionObj);
    displayTours(visibleTours, undefined, "filter-tour", 1, 4);
})