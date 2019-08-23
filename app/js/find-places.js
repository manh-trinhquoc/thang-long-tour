// Tạo request lấy data từ file json sau đó hiển thị
let xmlhttp = new XMLHttpRequest();
let url = "json/places.json";
let allPlacesData = {};

xmlhttp.open("GET", url, true);
xmlhttp.send();
xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        allPlacesData = JSON.parse(this.responseText);
        displayPlaces(allPlacesData, "place-result", 4, 4);
    }
};

function searchPlaces() {
    let searchRegex = document.getElementById('search-inpage').value.toLowerCase();
    searchRegex = new RegExp(searchRegex, 'g');
    let visiblePlacesData = {};
    for (id in allPlacesData) {
        let place = JSON.parse(JSON.stringify(allPlacesData[id]));
        let newString = place.location.toLowerCase().replace(searchRegex, `<span class="search-result">$&</span>`);
        if (newString != place.location.toLowerCase()) {
            place.location = newString;
            visiblePlacesData[id] = place;
            continue;
        }
        newString = place.name.toLowerCase().replace(searchRegex, `<span class="search-result">$&</span>`);
        if (newString != place.name.toLowerCase()) {
            place.name = newString;
            visiblePlacesData[id] = place;
            continue;
        }
    }
    displayPlaces(visiblePlacesData, "place-result", 4, 4);
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