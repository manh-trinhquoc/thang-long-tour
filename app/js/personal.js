let checkPersonalPageInitFinished = new Promise(function(resolve, reject) {
    let timer = setInterval(function() {
        if (currentUserObj.isAuthInitialized) {
            clearInterval(timer);
            resolve();
        }
    }, 500);
});

let tourPromise = new Promise(function(resolve, reject) {
    // lấy data về tour trong json
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

tourPromise.then(function(resolve) {
    // show tour đã xem gần đây
    let allToursData = resolve;
    visibleTours = getRecentlyViewedTours(allToursData, currentUserObj.historyViewed);
    displayTours(visibleTours, undefined, "filter-history", 4, 2);
});

let oldTourPromise = new Promise(function(resolve, reject) {
    let interval = setInterval(function() {
        if (currentUserObj.fetchedProfile && currentUserObj.isLoggedIn) {
            clearInterval(interval);
            resolve();
        }
    }, 500);
});

oldTourPromise.then(function(resolve) {
    console.group('show booked tour');
    let nextTourArr = [],
        lastTourArr = [];
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1;
    let yyyy = today.getFullYear();
    // thêm số 0 vào trước nếu cần
    dd = dd < 10 ? '0' + dd : dd;
    mm = mm < 10 ? '0' + mm : mm;
    let dateStr = `${yyyy}-${mm}-${dd}`;
    // console.log(currentUserObj);
    for (let tour of currentUserObj.tourbooked) {
        // console.log(tour);
        if (tour['departure-date'] > dateStr) {
            nextTourArr.push(tour);
        } else {
            lastTourArr.push(tour);
        }
    }

    // Sắp xếp lại next tour theo ngày tăng dần
    nextTourArr.sort(function(a, b) {
        return a['departure-date'] > b['departure-date'] ? -1 : 1;
    });

    // Sắp xếp lại last tour theo ngày giảm dần
    nextTourArr.sort(function(a, b) {
        return a['departure-date'] > b['departure-date'] ? 1 : -1;
    });


    let nextTours = convertDataArrToObj(nextTourArr);
    let lastTours = convertDataArrToObj(lastTourArr);
    console.log(nextTours);
    console.log(lastTours);
    displayTours(nextTours, undefined, "next-tour", 2, 1);
    displayTours(lastTours, undefined, "last-tour", 4, 2);
    console.groupEnd();
});

function discardUserChanges() {
    autoFillInput();
    document.getElementById('js-new-pass').value = '';
    document.getElementById('js-new-pass-2').value = '';
}

let showPassWord2 = (function() {
    let toggleShow = true;
    return function() {
        if (toggleShow) {
            document.getElementById('js-user-show-pass').innerHTML = `<i class="fas fa-eye"></i>`;
            toggleShow = false;
            document.getElementById('js-user-pass').setAttribute('type', 'text');
            document.getElementById('js-new-pass').setAttribute('type', 'text');
            document.getElementById('js-new-pass-2').setAttribute('type', 'text');
        } else {
            document.getElementById('js-user-show-pass').innerHTML = `<i class="fas fa-eye-slash"></i>`;
            toggleShow = true;
            document.getElementById('js-user-pass').setAttribute('type', 'password');
            document.getElementById('js-new-pass').setAttribute('type', 'password');
            document.getElementById('js-new-pass-2').setAttribute('type', 'password');
        }
    };
})();


function saveUserChanges() {

    // get user input and validate
    let isAllValidated = true;
    let elem = document.getElementById('js-user-name');
    if (!isValidated(['cannotEmpty'], elem)) isAllValidated = false;
    let displayName = elem.value;

    elem = document.getElementById('js-user-phone');
    if (!isValidated(['cannotEmpty', 'isPhoneNumber'], elem)) isAllValidated = false;
    let phone = elem.value;

    elem = document.getElementById('js-user-pass');
    if (!isValidated(['isEqualOldPass'], elem, currentUserObj.password)) isAllValidated = false;

    elem = document.getElementById('js-new-pass');
    if (!isValidated(['cannotEmpty', 'longerThan6Digit'], elem)) isAllValidated = false;
    let newPassword = elem.value;

    let elem2 = document.getElementById('js-new-pass-2');
    if (!isValidated(['isEqual'], elem, elem2)) isAllValidated = false;

    console.log('isAllValidated: ' + isAllValidated);
    if (!isAllValidated) return;


    let user = firebase.auth().currentUser.updatePassword(newPassword).then(function() {
        console.log('change password successful');
        // Update successful.
        user = firebase.auth().currentUser;
        // console.log(user);
        currentUserObj.displayName = displayName;
        currentUserObj.phone = phone;
        currentUserObj.password = newPassword;
        // user infomation được lưu vào database của firebase
        db.collection("users").doc(currentUserObj.email).set(currentUserObj).then(function() {
            alert(`Bạn ${displayName} đã thay đổi thông tin cá nhân thành công.\n Email: ${currentUserObj.email}.` +
                `\nSố điện thoại: ${phone}.\n Password: ${currentUserObj.password}.`);
            console.log('Thay đổi bản ghi thành công');
        }).catch(function(error) {
            console.error("Error adding document: ", error);
        });
    }).catch(function(error) {
        // Handle Errors here.
        let errorCode = error.code;
        let errorMessage = error.message;
        // [START_EXCLUDE]
        if (errorCode == 'auth/requires-recent-login') {
            alert('Phiên làm việc của bạn đã hết hạn. Bạn phải đăng nhập lại để thực hiện hành động này');
            signOut();
        } else {
            console.log(error);
        }
    });
}