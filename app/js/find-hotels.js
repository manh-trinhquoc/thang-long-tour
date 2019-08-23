// Xử lý các trạng thái của bộ lọc
let placesOfFilter = {
    // Object lưu các giá trị địa danh có thể có của bộc lọc
    "Quy Nhơn": {
        "Ghềnh Ráng": ["Chang Lia", "Tây Sơn"]
    },
    "Phú Quốc": {
        "Dương Đông": ["Trần Hưng Đạo"],
        "Dương Tơ": ["Suối Mây"]
    },
    "Sapa": {
        "street": ["Thác Bạc", "So Than", "Cầu Mây"]
    },
    "Hạ Long": {
        "Hùng Thắng": []
    },
    "Đà Nẵng": {
        "Sơn Trà": ["Lê Đức Thọ"],
        "Hải Châu": ["Ông Ích Khiêm"]
    }
};

(function() {
    //add các giá trị vào bộ lọc city
    let elem = '<option value="null">Tất cả</option>';
    for (city in placesOfFilter) {
        elem += `<option value="${city}">${city}</option>`;
    }
    document.getElementById('city').innerHTML = elem;
})();

function changeCity(cityValue) {
    // console.group("changeCity()");
    let elem = '<option value="null">Tất cả</option>';
    let city = placesOfFilter[cityValue];
    // console.log(city);
    for (ward in city) {
        if (ward == "street") continue;
        elem += `<option value="${ward}">${ward}</option>`;
    }
    document.getElementById('ward').innerHTML = elem;
    changeWard();
    // console.groupEnd();
}

function changeWard(wardValue) {
    // console.group('changeWard()');
    let elem = '<option value="null">Tất cả</option>';
    let cityValue = document.getElementById('city').value;
    let streetArr = [];
    try {
        streetArr = placesOfFilter[cityValue][wardValue];
    } catch {
        streetArr = [];
    }

    // console.log(streetArr);
    for (each in streetArr) {
        elem += `<option value="${streetArr[each]}">${streetArr[each]}</option>`;
    }
    // Trường hợp không có phường
    try {
        streetArr = placesOfFilter[cityValue]['street'];
    } catch {
        streetArr = [];
    }

    for (each in streetArr) {
        elem += `<option value="${streetArr[each]}">${streetArr[each]}</option>`;
    }
    document.getElementById('street').innerHTML = elem;
    // console.groupEnd();
}

// Tạo request lấy data từ file json sau đó hiển thị
let xmlhttp = new XMLHttpRequest();
let url = "json/hotels.json";
let allHotelData = {};

xmlhttp.open("GET", url, true);
xmlhttp.send();
xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        allHotelData = JSON.parse(this.responseText);
        displayHotels(allHotelData, "hotel-result", 3, 5);
    }
};

// Áp dụng bộ lọc
function getCondition() {
    let conditionObj = {};
    conditionObj.city = document.getElementById('city').value;
    conditionObj.ward = document.getElementById('ward').value;
    conditionObj.street = document.getElementById('street').value;
    let elemArr = document.querySelectorAll('#category input');
    for (let elem of elemArr) {
        if (elem.checked) {
            conditionObj.category = elem.value;
            break;
        }
    }
    elemArr = document.querySelectorAll('#stars input');
    for (let elem of elemArr) {
        if (elem.checked) {
            conditionObj.stars = parseInt(elem.value);
            break;
        }
    }
    // change "null" to null
    for (let prop in conditionObj) {
        if (conditionObj[prop] == 'null') {
            conditionObj[prop] = null;
        }
    }
    return conditionObj;
}

function filterHotels() {
    // console.group('filterHotels()');
    let visibleHotelData = {};
    let conditionObj = getCondition();
    // console.log(conditionObj);
    for (id in allHotelData) {
        let hotel = allHotelData[id];
        let isPassCondition = true;
        for (prop in conditionObj) {
            let conditionValue = conditionObj[prop];
            let hotelValue = hotel[prop];
            if (!conditionValue || !hotelValue) continue;
            if (conditionValue != hotelValue) {
                isPassCondition = false;
                break;
            }
        }
        if (isPassCondition) {
            visibleHotelData[id] = hotel;
        }
    }
    displayHotels(visibleHotelData, "hotel-result", 4, 4);
    // console.groupEnd();
}

// gán các sự kiện cho đối tượng lọc
document.getElementById('city').addEventListener('change', function() {
    changeCity(document.getElementById('city').value);
    filterHotels();
})

document.getElementById('ward').addEventListener('change', function() {
    changeWard(document.getElementById('ward').value);
    filterHotels();
})

document.getElementById('street').addEventListener('change', function() {
    filterHotels();
})

let elemArr = document.querySelectorAll('#category input');
for (let elem of elemArr) {
    elem.addEventListener('change', function() {
        // console.log(elem.value);
        filterHotels();
    });
}

elemArr = document.querySelectorAll('#stars input');
for (let elem of elemArr) {
    elem.addEventListener('change', function() {
        filterHotels();
    });
}