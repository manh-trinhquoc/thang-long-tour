function dynamicallyLoadScript(url, defer = true, async = false) {
    var script = document.createElement("script"); //Make a script DOM node
    script.src = url; //Set it's src to the provided URL
    if (defer) script.setAttribute('defer', '');
    if (async) script.setAttribute('async', '');
    document.head.appendChild(script); //Add it to the end of the head section of the page
}

function includeHTML() {
    var z, i, elmnt, file, xhttp;
    /* Loop through a collection of all HTML elements: */
    z = document.getElementsByTagName("*");
    for (i = 0; i < z.length; i++) {
        elmnt = z[i];
        /*search for elements with a certain atrribute:*/
        file = elmnt.getAttribute("include-html");
        if (file) {
            /* Make an HTTP request using the attribute value as the file name: */
            xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4) {
                    if (this.status == 200) { elmnt.innerHTML = this.responseText; }
                    if (this.status == 404) { elmnt.innerHTML = "Page not found."; }
                    /* Remove the attribute, and call this function once more: */
                    elmnt.removeAttribute("include-html");
                    includeHTML();
                }
            }
            xhttp.open("GET", file, true);
            xhttp.send();
            /* Exit the function: */
            return;
        }
    }
}

// Add js library
dynamicallyLoadScript('/thang-long-tour/comp/top-nav.js')
dynamicallyLoadScript('/thang-long-tour/comp/header.js')
dynamicallyLoadScript('/thang-long-tour/comp/register-popover.js')

// add include html 
includeHTML();


// Các hàm chung thông thường
function convertDataObjToArr(dataObj) {
    let dataArr = [];
    for (id in dataObj) {
        let item = dataObj[id];
        item.id = id;
        dataArr.push(item);
    }
    return dataArr;
}

function convertDataArrToObj(dataArr) {
    let dataObj = {};
    for (each of dataArr) {
        let id = each.id;
        delete each.id;
        dataObj[id] = each;
    }
    return dataObj;
}

// Các hàm hiển thị tour lên màn hình
function displayTours(productData, page, elemID, maxItemPerRow = 3, maxRow = 4) {
    // Khai báo hiển thị dữ liệu từ data
    // Lấy số trang hiện tại
    if (!page) page = 1;
    // console.log(page);
    let maxItemPerPage = maxRow * maxItemPerRow;
    let elem = '<div class="row">';
    let countInProductData = 0;
    let countItemInRow = 0;
    let countRow = 0;
    let startAt = (page - 1) * maxItemPerPage;
    //     console.log(startAt);
    for (id in productData) {
        // console.log("id: " + id);
        if (countInProductData < startAt) {
            // Bỏ qua những item nằm ở trang < trang này
            countInProductData++;
            continue;
        }
        countInProductData++;
        countItemInRow++;
        let product = productData[id];
        elem +=
            `<div class="card">
                        <a href="detail-tour.html?id=${id}">
                            <div class="card__img">
                                <img src="${product.img[0]}" alt="demo image" />`
        if (product['sale-off'] < 0) {
            elem += `<div class="card__sale">${product['sale-off']}</div>`
        }

        elem += `</div>
                            <h4 class="card__country">${product.destination}</h4>
                            <h3 class="card__header">${product.name}</h3>
                            <h5 class="card__price">${product.price}</h5>
                            <h5 class="card__duration">Thời gian: ${product.day} ngày ${product.night} đêm</h5>
                            <h5 class="card__start-date">Khởi hành: ${product['departure-date']}</h5>
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
    let numbOfProduct = Object.keys(productData).length
    let numbOfPage = Math.ceil(numbOfProduct / maxItemPerPage);
    return numbOfPage;
}

function filterCondition(productData, conditionObj) {
    // Lọc product với điều kiện tất cả condition phải thỏa mãn.
    // Bỏ qua trường hợp condition không tồn tại.
    console.group("filterCondition()");
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
            if (product[key] != conditionObj[key]) {
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

function filterConditionArr(productData, conditionArr) {
    // Lọc data với điều kiện đầu vào là 1 array
    // Tất cả các điều kiện trong condition array phải được thỏa mãn
    console.group("filterConditionArr()");
    let newProductData = {};
    for (id in productData) {
        // console.group("id: " + id);
        let productTripTypeValues = productData[id]['trip-type'];
        // console.log("product[trip-type]: " + productTripTypeValues);
        // console.log('conditionArr: ' + conditionArr);
        let isProductPass = true;
        // console.log(JSON.stringify(newProductData));
        if (productTripTypeValues) {
            isProductPass = isArrContain(conditionArr, productTripTypeValues)
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

function isArrContain(smallArr, bigArr) {
    // Hàm check xem array lớn có chứa tất cả các phần tử của array nhỏ hay không
    // console.group('isArrContain');
    for (small of smallArr) {
        let isContain = false;
        for (big of bigArr) {
            if (small == big) {
                isContain = true;
                break;
            }
        }
        if (isContain == false) {
            // console.groupEnd();
            return false;
        }

    }
    // console.groupEnd();
    return true;
}

function displayPlaces(productData, elemID, maxItemPerRow = 3, maxRow = 4) {
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
            `<div class="card">
                        <a href="detail-place.html?id=${id}">
                            <div class="card__img">
                                <img src="${product.img[0]}" alt="demo image" />
                             </div>
                            <h4 class="card__country">${product.location}</h4>
                            <h3 class="card__header-full">${product.name.toLowerCase()}</h3>
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

function displayBlogs(productData, elemID, maxItemPerRow = 3, maxRow = 4) {
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
            `<div class="card">
                        <a href="detail-blog.html?id=${id}">
                            <div class="card__img">
                                <img src="${product.img[0]}" alt="demo image" />
                             </div>
                            <h4 class="card__upload-date">${product['upload-date']}</h4>
                            <h3 class="card__header-full">${product.name.toLowerCase()}</h3>
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

// Tạo object lưu thông tin về user
let currentUserObj = {
    isAppInitialized: false,
    isLoggedIn: false,
    tourbooked: null,
    historyViewed: [],
    oldTours: []
}

// Lấy thông tin về lịch sử duyệt web từ localStorage
console.group('Lấy thông tin về lịch sử duyệt web từ localStorage')
if (localStorage.getItem('historyViewed')) {
    currentUserObj.historyViewed = JSON.parse(localStorage.getItem('historyViewed'));
    // console.log(currentUserObj.historyViewed);
}
// console.log(currentUserObj);
console.groupEnd();

// Hàm quản lý view
function manageView() {
    console.group('manageView')
    if (currentUserObj.isLoggedIn) {
        document.getElementById('register-dropdown-wrapper').removeAttribute('style');
        document.getElementById('topnav__register').style.display = 'none';
    }
    if (!currentUserObj.isLoggedIn) {
        document.getElementById('register-dropdown-wrapper').style.display = 'none';
        document.getElementById('topnav__register').removeAttribute('style');
    }
    console.groupEnd();
}