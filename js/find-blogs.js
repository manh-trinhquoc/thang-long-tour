// Tạo request lấy data từ file json sau đó hiển thị
let xmlhttp = new XMLHttpRequest();
let url = "/thang-long-tour/json/blogs.json";
let allBlogsData = {};

xmlhttp.open("GET", url, true);
xmlhttp.send();
xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        allBlogsData = JSON.parse(this.responseText);
        displayBlogs(allBlogsData, "blog-result", 4, 4);
    }
};

function searchBlogs() {
    let searchRegex = document.getElementById('search-inpage').value.toLowerCase();
    searchRegex = new RegExp(searchRegex, 'g');
    let visibleBlogsData = {};
    for (id in allBlogsData) {
        let blog = JSON.parse(JSON.stringify(allBlogsData[id]));
        let newString = '';
        newString = blog.name.toLowerCase().replace(searchRegex, `<span class="search-result">$&</span>`);
        if (newString != blog.name.toLowerCase()) {
            blog.name = newString;
            visibleBlogsData[id] = blog;
        }

    }
    displayBlogs(visibleBlogsData, "blog-result", 4, 4);
}

// trigger search event when user hit enter
// Get the input field
let input = document.getElementById("search-inpage");

// Execute a function when the user releases a key on the keyboard
input.addEventListener("keyup", function(event) {
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
        // Cancel the default action, if needed
        event.preventDefault();
        // Trigger the button element with a click
        document.getElementById("search-inpage-btn").click();
    }
});