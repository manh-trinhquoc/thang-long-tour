// Dựa vào url của trang để tick những lựa chọn đã được chọn.

function setInputSelected(queryString, variable) {
    let elems = document.querySelectorAll(queryString);
    if (elems.length == 0) {
        // console.log("cannot match elems of " + queryString);
        return;
    }
    for (each of elems) {
        if (!variable) {
            // console.log("variable of" + queryString + " is not define")
            return;
        }
        if (each.value.toLowerCase() == variable.toLowerCase()) {
            // console.log("set selected of " + queryString)
            each.setAttribute("selected", "");
            return;
        }
    }
    console.log("cannot find match value of " + queryString + " to set selected");
}

function setInputDateValue(queryString, variable) {
    let elems = document.querySelectorAll(queryString);
    if (elems.length == 0) {
        // console.log("cannot match elems of " + queryString);
        return;
    }
    for (each of elems) {
        if (!variable) {
            // console.log("variable of" + queryString + " is not define")
            return;
        }
        each.setAttribute("value", variable);
    }
}

function setInputChecked(queryString, variable) {
    let elems = document.querySelectorAll(queryString);
    if (elems.length == 0) {
        console.log("cannot match elems of " + queryString);
        return;
    }
    for (each of elems) {
        if (!variable) {
            // console.log("variable of" + queryString + " is not define")
            return;
        }
        if (each.value.toLowerCase() == variable.toLowerCase()) {
            // console.log("set selected of " + queryString)
            each.setAttribute("checked", "");
            return;
        }
    }
    console.log("cannot find match value of " + queryString + " to set checked");
}

// Gọi các hàm tick lựa chọn
let URIDecoded = decodeURI(document.URL);
URIDecoded = URIDecoded.replace(/\+/g, " ");
let filterArr = [];
try {
    let filterArrFromURL = URIDecoded.split("?")[1].split("&");
    filterArr = filterArrFromURL.map(value => {
        return value.split("=");
    });
} catch {
    console.log("there is not any attribute in url");
}
// Tạo condition object có property và giá trị là attribute trên url
let filterConditionObj = {};
for (each of filterArr) {
    if (each[0] != 'trip-type') filterConditionObj[each[0]] = each[1];
    else {
        if (!filterConditionObj[each[0]]) filterConditionObj[each[0]] = [];
        filterConditionObj[each[0]].push(each[1]);

    }
}
// console.log(filterConditionObj);
setInputSelected("#departure option", filterConditionObj.departure);
setInputSelected("#destination option", filterConditionObj.destination);
setInputSelected("#duration option", filterConditionObj.duration);
setInputSelected("#sort option", filterConditionObj.sort);
setInputDateValue("#departure-date", filterConditionObj["departure-date"]);
if (filterConditionObj['trip-type']) {
    for (each of filterConditionObj['trip-type']) {
        setInputChecked(`#${each}`, each);
    }
}

console.log('Kết thúc việc tick những lựa chọn đã được chọn');

// lấy data từ JSON và hiển thị kết quả lọc


function addPagination(numbOfPage) {
    console.group("addPagination");
    let documentURL = document.URL;
    // lọc bỏ attribute page=1& đã thêm trước đó
    documentURL = documentURL.replace(/&?page=[0-9]*/g, "");
    // console.log('documentURL: ' + documentURL);
    // kiểm tra url đã có ? chưa để tạo url trong pagination
    let href = '';
    if (documentURL.search(/\?/) < 0) {
        href = documentURL + '?page=';
    } else {
        href = documentURL + '&page=';
    }
    // Thêm các trang
    let elem = '';
    if (numbOfPage > 1) {
        elem += `<a href="#" class="disable">&laquo;</a>`;
    }

    elem += `<a href="${href + 1}" class="active">1</a>`;
    for (let i = 2; i <= numbOfPage; i++) {
        elem += `<a href="${href + i}">${i}</a>`;
    }
    if (numbOfPage > 1) {
        elem += `<a href="${href + 2}">&raquo;</a>`;
    }
    document.getElementById('pagination').innerHTML = elem;
    console.groupEnd();
}

function managePaginationAppearance(currentPage) {
    console.group('managePaginationAppearance');
    if (!currentPage) currentPage = 1;
    // console.log(currentPage);
    let pageElements = document.querySelectorAll('#pagination a');
    let lastPage = pageElements.length - 2;
    // console.log(pageElements);
    for (let i = 0; i < pageElements.length; i++) {
        // console.log(i);
        // console.log(pageElements[i]);
        if (currentPage == i) pageElements[i].classList.add('active');
        else pageElements[i].classList.remove('active');
    }
    if (currentPage == 1) {
        pageElements[0].classList.add("disable");
    } else {
        pageElements[0].classList.remove("disable");
    }
    if (currentPage == lastPage) {
        pageElements[pageElements.length - 1].classList.add("disable");
    } else {
        pageElements[pageElements.length - 1].classList.remove("disable");
    }
    // modify content of pagination << and >>
    let url = document.URL;
    let href = '';
    // trường hợp trên url chưa có attribute
    if (url.search(/\?/) < 0) href = '?page=2';
    else href = '&page=2';
    // trường hợp url chưa có page
    if (url.search(/page=[0-9]*/) < 0) {
        href = url + href;
    } else {
        href = url.replace(/page=[0-9]*/g, `page=${currentPage- 1}`);
        pageElements[0].setAttribute('href', href);
        href = url.replace(/page=[0-9]*/g, `page=${+currentPage+ 1}`);
        pageElements[pageElements.length - 1].setAttribute('href', href);
    }

    console.groupEnd();
}

function filterDate(productData, conditionObj) {
    // Khi lọc ngày thì sẽ hiển thị những tour từ ngày được chọn về sau
    // Bỏ qua trường hợp condition không tồn tại.
    console.group("filterDate()");
    let newProductData = {};
    for (id in productData) {
        // console.group("id: " + id);
        let product = productData[id];
        let isProductPass = true;
        // console.log(JSON.stringify(newProductData));
        for (key in conditionObj) {
            // console.log("key: " + key);
            // console.log("conditionObj[key]: " + conditionObj[key]);
            // console.log("product[key]: " + product[key]);
            // debugger;
            if (!conditionObj[key] || conditionObj[key] == 'null') {
                // console.log('conditionObj[key] is undefine or null');
                continue;
            }
            if (!product[key]) {
                // console.log('product[key] is undefine');
                continue;
            }
            if (product[key] < conditionObj[key]) {
                // console.log('delete product: ' + id);
                isProductPass = false;
                break;
            }
        }
        if (!isProductPass) {
            // console.log('item is not added to new productData');
            // console.groupEnd();
            continue;
        }
        // console.log('item is added to newProductData');
        newProductData[id] = JSON.parse(JSON.stringify(productData[id]));
        // console.groupEnd();
    }

    console.groupEnd();
    return newProductData;
}

// Sắp xếp data sau khi có sort
function sortData(dataArrInput, property, option = "increment") {
    // Hàm sort dữ liệu
    let dataArrOutput = JSON.parse(JSON.stringify(dataArrInput));
    dataArrOutput.sort(function(a, b) {
        if (!a[property]) return 0;
        if (!b[property]) return 0;
        if (option == 'increment') {
            return (a[property] > b[property]) ? 1 : -1;
        } else {
            return (a[property] > b[property]) ? -1 : 1;
        }
    })
    return dataArrOutput;
}
// test sort function
// let obj1 = {
//     "price": 3,
//     "sale-off": 3,
//     "departure-date": "2019-04-02"
// }
// let obj2 = {
//     "price": 1,
//     "sale-off": 2,
//     "departure-date": "2019-04-01"
// }
// let obj3 = {
//     "price": 2,
//     "sale-off": 1,
//     "departure-date": "2019-04-03"
// }
// let testArr = [obj1, obj2, obj3];
// console.log('testArr: ' + JSON.stringify(testArr));
// console.log('sort price: ' + JSON.stringify(sortData(testArr, 'price')));
// console.log('sort sale-off: ' + JSON.stringify(sortData(testArr, 'sale-off')));
// console.log('sort date: ' + JSON.stringify(sortData(testArr, 'departure-date')));
// console.log('sort unknow-property: ' + JSON.stringify(sortData(testArr, 'unknow-property')));
// console.log('sort date decre: ' + JSON.stringify(sortData(testArr, 'departure-date', 'decrement')));

function sortTours(productData, sortCommand) {
    // console.log(sortCommand);
    if (!sortCommand) productData;
    // change productData object to array to sort
    let dataArr = convertDataObjToArr(productData);
    // Call sort function base on sort command
    if (sortCommand == 'price-incre') {
        dataArr = sortData(dataArr, 'price');
    } else if (sortCommand == 'price-decre') {
        dataArr = sortData(dataArr, 'price', 'decre');
    } else if (sortCommand == 'departure-date-incre') {
        dataArr = sortData(dataArr, 'departure-date');
    } else if (sortCommand == 'departure-date-decre') {
        dataArr = sortData(dataArr, 'departure-date', 'decre');
    }
    // test sortsArr after sorted
    // for (each of dataArr) {
    //     console.log(each.price);
    // }
    // change sorted tour array back to object
    let sortedProductData = convertDataArrToObj(dataArr);
    return sortedProductData;
}

// Tạo request lấy data từ file json sau đó hiển thị
let xmlhttp = new XMLHttpRequest();
let url = "/thang-long-tour/json/tours.json";
xmlhttp.open("GET", url, true);
xmlhttp.send();
xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        let allToursData = JSON.parse(this.responseText);
        // console.log(JSON.stringify(allToursData));
        // console.log(allToursData);
        let conditionObj = {
            'departure': filterConditionObj['departure'],
            'destination': filterConditionObj['destination'],
            'duration': filterConditionObj['duration'],
        };
        let visibleTours = filterCondition(allToursData, conditionObj);
        if (Array.isArray(filterConditionObj['trip-type'])) {
            visibleTours = filterConditionArr(visibleTours, filterConditionObj['trip-type']);
        }
        visibleTours = filterDate(visibleTours, { 'departure-date': filterConditionObj['departure-date'] })
        visibleTours = sortTours(visibleTours, filterConditionObj['sort']);
        // console.log(visibleTours);
        let numbOfPage = displayTours(visibleTours, filterConditionObj["page"], "filter-result");
        addPagination(numbOfPage);
        managePaginationAppearance(filterConditionObj["page"]);
    }
};

// Khi user bấm sort thì tương đương bấm submit
function onClickSort() {
    document.getElementById('filter-form').submit();
}