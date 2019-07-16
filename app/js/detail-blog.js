// hiển thị bài blog
let xmlhttp2 = new XMLHttpRequest();
let url2 = "json/blogs.json";
let allBlogsData = {};

xmlhttp2.open("GET", url2, true);
xmlhttp2.send();
xmlhttp2.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        allBlogsData = JSON.parse(this.responseText);
        // show blog detail
        let id = document.location.href.split('=')[1];
        showDetailBlog(allBlogsData[id]);
        // Show các bài viết khác
        let visibleBlogs = getSimilar(allBlogsData, id);
        displayBlogs(visibleBlogs, "blog-result", 4, 2);
    }
};

function showDetailBlog(blogObj) {
    // hiển thị chi tiết bài viết về blog
    document.getElementById('blog-title').innerText = blogObj['name-full'];
    let elem = `<div class="detail__carosel">
                    <img class="img-responsive" src="${blogObj.img[0]}" alt="${blogObj['name-full']}" />
                </div>`;
    // Tạo request lấy chi tiết về blog trong file html sau đó hiển thị
    let xmlhttp = new XMLHttpRequest();
    let url = blogObj.link;
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
            if (this.status == 200) { elem += this.responseText; }
            if (this.status == 404) { elem += "Page not found."; }
        }
        document.getElementById('blog-detail').innerHTML = elem;
    };
}

// Hiển thị places du lịch
let xmlhttp = new XMLHttpRequest();
let url = "json/places.json";

xmlhttp.open("GET", url, true);
xmlhttp.send();
xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        let allPlacesData = JSON.parse(this.responseText);
        let id = document.location.href.split('=')[1].replace(/[Bb]/, 'P');
        let visiblePlaces = getSimilar(allPlacesData, id);
        displayPlaces(visiblePlaces, "place-result", 4, 2);
    }
};

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
            destination: allBlogsData[id]['location-related'][0]
        }
        // console.log(JSON.stringify(conditionObj))
        visibleTours = filterCondition(allToursData, conditionObj);
        displayTours(visibleTours, undefined, "filter-tour", 1, 4);
    }
};