function loadScript(src, defer = true, async = false) {

    return new Promise(function(resolve, reject) {
        let script = document.createElement("script"); //Make a script DOM node
        script.src = src; //Set it's src to the provided URL
        if (defer) script.setAttribute('defer', '');
        if (async) script.setAttribute('async', '');
        script.onload = () => resolve(script);
        script.onerror = () => reject(new Error(`Script load error for ${src}`));
        document.head.appendChild(script); //Add it to the end of the head section of the page
    });

}

// function includeHTML() {
//     var z, i, elmnt, file, xhttp;
//     console.group('includeHTML');
//     /* Loop through a collection of all HTML elements: */
//     z = document.getElementsByTagName("*");
//     for (i = 0; i < z.length; i++) {
//         elmnt = z[i];
//         /*search for elements with a certain atrribute:*/
//         file = elmnt.getAttribute("include-html");
//         if (file) {
//             console.log(file);
//             /* Make an HTTP request using the attribute value as the file name: */
//             xhttp = new XMLHttpRequest();
//             xhttp.onreadystatechange = function() {
//                 if (this.readyState == 4) {
//                     if (this.status == 200) { elmnt.innerHTML = this.responseText; }
//                     if (this.status == 404) { elmnt.innerHTML = "Page not found."; }
//                     /* Remove the attribute, and call this function once more: */
//                     elmnt.removeAttribute("include-html");
//                     includeHTML();
//                 }
//             }
//             xhttp.open("GET", file, true);
//             xhttp.send();
//             /* Exit the function: */
//             console.log('innerHTML return');
//             console.groupEnd();
//             return new Promise(function(resolve, reject) {
//                 resolve(1);
//             });
//         }
//     }
//     console.log('innerHTML reach end-line of function');
//     console.groupEnd();
// }

function includeHTML() {
    console.group('includeHTML');
    /* Loop through a collection of all HTML elements: */
    let z = document.querySelectorAll('*[include-html]');
    // console.log(z);
    // chuyển nodelist sang arr
    let arr = [];
    for (let each of z) {
        arr.push(each);
    }
    // console.log(arr);
    let promiseArr = arr.map(elem => {
        return new Promise(function(resolve, reject) {
            /* Make an HTTP request using the attribute value as the file name: */
            let xhttp = new XMLHttpRequest();
            let file = elem.getAttribute("include-html");
            xhttp.open("GET", file, true);
            xhttp.send();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4) {
                    if (this.status == 200) { elem.innerHTML = this.responseText; }
                    if (this.status == 404) { elem.innerHTML = "Page not found."; }
                    /* Remove the attribute, and call this function once more: */
                    elem.removeAttribute("include-html");
                    resolve(1);
                }

            }
        });
    });
    console.groupEnd();
    return Promise.all(promiseArr).then(function(resolve) {
        console.log('includeHTML replaced all elements')
        return new Promise(function(resolve, reject) {
            resolve(1);
        });
    });
}

// Các hàm chung thông thường
function convertDataObjToArr(dataObj) {
    let dataArr = [];
    for (id in dataObj) {
        let item = JSON.parse(JSON.stringify(dataObj[id]));
        item.id = id;
        dataArr.push(item);
    }
    return dataArr;
}

function convertDataArrToObj(dataArr) {
    let dataObj = {};
    for (each of dataArr) {
        let id = JSON.parse(JSON.stringify(each.id));
        delete each.id;
        dataObj[id] = each;
    }
    return dataObj;
}

function convertNumbToString(numb) {
    let strArr = `${numb}`.split('');
    let maxIndex = strArr.length - 1;
    for (let i = maxIndex; i >= 0; i--) {
        // i < max index - 1
        if ((maxIndex - i) % 3 == 0 && i != maxIndex && strArr[i] != '-') {
            strArr.splice(i + 1, 0, '.');
        }
    }
    return strArr.join('');
}

function formatDate(date) {
    if (!date) return '';
    let [year, month, day] = date.split('-');
    let formatedDate = [day, month, year].join('/');
    return formatedDate;
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
            elem += `<div class="card__sale">${convertNumbToString(product['sale-off'])}</div>`
        }

        elem += `</div>
                            <h4 class="card__country">${product.destination}</h4>
                            <h3 class="card__header">${product.name}</h3>
                            <h5 class="card__price">${convertNumbToString(product.price)}</h5>
                            <h5 class="card__duration">Thời gian: ${product.day} ngày ${product.night} đêm</h5>
                            <h5 class="card__start-date">Khởi hành: ${formatDate(product['departure-date']) }</h5>
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

            // console.log(product[key]);
            // console.log(conditionObj[key]);
            // debugger;
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

function filterConditionArr(productData, conditionArr, property = 'trip-type') {
    // Lọc data với điều kiện đầu vào là 1 array
    // Tất cả các điều kiện trong condition array phải được thỏa mãn
    console.group("filterConditionArr()");
    let newProductData = {};
    for (id in productData) {
        // console.group("id: " + id);
        let productTripTypeValues = productData[id][property];
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

function getSimilar(productData, currentID) {
    // trả về tối đa 4 data nằm trước và 4 data nằm sau id hiện tại
    console.group('getSimilar tour tương tự');
    let productDataArr = convertDataObjToArr(productData);
    let resultArr = [];
    for (let i in productDataArr) {
        if (productDataArr[i].id == currentID) {
            // console.log('i: ' + i);
            // console.log(productDataArr[i]);
            for (let count = 1; count <= 4; count++) {
                // console.log('count: ' + count);
                resultArr.push(productDataArr[+i + count]);
                resultArr.push(productDataArr[+i - count]);
            }
        }
    }
    // lọc ra các đối tượng undefine
    let resultArr2 = [];
    for (each of resultArr) {
        if (each) resultArr2.push(each);
    }
    // console.log(resultArr);
    console.groupEnd();
    return convertDataArrToObj(resultArr2);
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
                            <h4 class="card__upload-date">${formatDate(product['upload-date'])}</h4>
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

function getRecentlyViewedTours(productData, historyViewedArr) {
    // Lọc tour với điều kiện product id nằm trong lịch sử xem tour
    console.group('getRecentlyViewedTours()');

    let newProductData = {};
    for (tourID of historyViewedArr) {
        for (id in productData) {
            if (id == tourID) {
                newProductData[id] = JSON.parse(JSON.stringify(productData[id]));
            }
        }
    }

    console.groupEnd();
    return newProductData;
}

// Hàm quản lý view
function manageView() {
    console.group('manageView')
    // console.log(currentUserObj.isLoggedIn);
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