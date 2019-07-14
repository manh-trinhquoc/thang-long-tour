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

function displayHotels(productData, elemID, maxItemPerRow = 3, maxRow = 4) {
    // Khai báo hiển thị dữ liệu từ data
    let maxItemPerPage = maxRow * maxItemPerRow;
    let elem = '<div class="row">';
    let countInProductData = 0;
    let countItemInRow = 0;
    let countRow = 0;

    for (id in productData) {
        countInProductData++;
        countItemInRow++;
        let product = productData[id];
        elem +=
            `<div class="card-hotel">
                <a href="detail-hotel.html?id=${id}">
                    <div class="card__img">
                        <img src="${product.img[0]}" alt="demo image" class="img-responsive"/>
                    </div>
                    <div class="row">
                        <h4 class="card-hotel__category">${product.category}</h4>
                        <h4 class="card-hotel__star"> ${addStars(product.stars)}</h4>
                    </div>
                    <h3 class="card-hotel__name">${product.name}</h3>
                    <h5 class="card-hotel__address"><i class="fas fa-map-marker"></i>
                            ${product.address}
                    </h5>
                </a>
            </div>`;
        if (countItemInRow >= maxItemPerRow) {
            countItemInRow = 0;
            elem += `</div><div class="row">`;
            countRow++;
        }
        if (countRow >= maxRow) {
            break;
        }
    }
    // Bổ sung thẻ card cho đủ số cột
    if (countRow < maxRow && countItemInRow > 0) {
        for (let i = countItemInRow; i < maxItemPerRow; i++) {
            elem += `<div class="card"></div>`;
        }
    }
    // Đóng thẻ .row
    elem += `</div>`
    document.getElementById(elemID).innerHTML = elem;
}

function addStars(numbOfStar) {
    let result = '';
    for (let i = 0; i < numbOfStar; i++) {
        result += `<i class="fas fa-star"></i>`
    }
    return result;
}

// Tạo request lấy data từ file json sau đó hiển thị
let xmlhttp = new XMLHttpRequest();
let url = "/thang-long-tour/json/hotels.json";
let allHotelData = {};

xmlhttp.open("GET", url, true);
xmlhttp.send();
xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        allHotelData = JSON.parse(this.responseText);
        displayHotels(allHotelData, "hotel-result", 4, 4);
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