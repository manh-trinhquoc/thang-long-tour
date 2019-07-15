function hidePopover(id) {
    // console.group("hidePopover");
    // console.trace();
    // console.groupEnd();
    let elePopover = document.getElementById(id);
    elePopover.setAttribute("hidden", "");
    event.stopPropagation()
}

function showPopover(id) {
    // console.group("showPopover");
    // console.trace();
    // console.groupEnd();
    let elePopover = document.getElementById(id);
    elePopover.removeAttribute("hidden");
    event.stopPropagation()
}

// Các hàm bật/tắt popover
function showSignInForm() {
    let eleSignUpForm = document.getElementById("sign-up");
    let eleSignInForm = document.getElementById("sign-in");
    if (eleSignInForm.hasAttribute("hidden")) {
        eleSignInForm.removeAttribute("hidden");
        eleSignUpForm.setAttribute("hidden", "");
    }
    document.getElementById("sign-in-btn").classList.remove("deactive");;
    document.getElementById("sign-up-btn").classList.add("deactive");
    event.stopPropagation()
}

function showSignUpForm() {
    let eleSignUpForm = document.getElementById("sign-up");
    let eleSignInForm = document.getElementById("sign-in");
    if (eleSignUpForm.hasAttribute("hidden")) {
        eleSignUpForm.removeAttribute("hidden");
        eleSignInForm.setAttribute("hidden", "");
    }
    document.getElementById("sign-up-btn").classList.remove("deactive");;
    document.getElementById("sign-in-btn").classList.add("deactive");
    event.stopPropagation()
}

let showPassWord = (function() {
    let toggleShow = true;
    return function(elem) {
        if (toggleShow) {
            elem.innerHTML = `<i class="fas fa-eye"></i>`;
            toggleShow = false;
            document.getElementById('sign-up-pass').setAttribute('type', 'text');
            document.getElementById('sign-up-pass-2').setAttribute('type', 'text');
        } else {
            elem.innerHTML = `<i class="fas fa-eye-slash"></i>`;
            toggleShow = true;
            document.getElementById('sign-up-pass').setAttribute('type', 'password');
            document.getElementById('sign-up-pass-2').setAttribute('type', 'password');
        }
    };
})();

function submitSignUp(event) {
    // Khi người dùng submit form đăng ký    
    event.preventDefault();
    // get user input and validate
    let isAllValidated = true;
    let elem = document.getElementById('sign-up-name');
    if (!isValidated(['cannotEmpty'], elem)) isAllValidated = false;
    let fullName = elem.value;

    elem = document.getElementById('sign-up-phone');
    if (!isValidated(['cannotEmpty', 'isPhoneNumber'], elem)) isAllValidated = false;
    let phone = elem.value;

    elem = document.getElementById('sign-up-email');
    if (!isValidated(['cannotEmpty', 'isEmail'], elem)) isAllValidated = false;
    let email = elem.value;

    elem = document.getElementById('sign-up-pass');
    if (!isValidated(['cannotEmpty', 'longerThan6Digit'], elem)) isAllValidated = false;
    let password = elem.value;

    let elem2 = document.getElementById('sign-up-pass-2');
    if (!isValidated(['isEqual'], elem, elem2)) isAllValidated = false;

    console.log('isAllValidated: ' + isAllValidated);
    if (!isAllValidated) return;
    // Sign in with email and pass.
    // [START createwithemail]
    alert("Chúng tôi đang tạo tài khoản cho bạn");
    firebase.auth().createUserWithEmailAndPassword(email, password).then(function(user) {
        console.group('createUserWithEmailAndPassword');
        user = firebase.auth().currentUser;
        console.log(user);
        currentUserObj.fullName = fullName;
        currentUserObj.phone = phone;
        currentUserObj.email = email;
        currentUserObj.password = password;
        // user infomation được lưu vào database của firebase
        db.collection("users").doc(email).set(currentUserObj).then(function() {
                alert(`Bạn ${fullName} đã tạo tài khoản thành công.\n Email: ${email}.\n Số điện thoại: ${phone}.\n Password: ${password}.`);
                console.log('Tạo bản ghi thành công');
            })
            .catch(function(error) {
                console.error("Error adding document: ", error);
            });

        console.groupEnd();
    }).catch(function(error) {
        console.group('createUserWithEmailAndPassword()');
        // Handle Errors here.
        let errorCode = error.code;
        let errorMessage = error.message;
        // [START_EXCLUDE]
        if (errorCode == 'auth/weak-password') {
            alert('Mật khẩu của bạn quá ngắn');
        } else if (errorCode == 'auth/email-already-in-use') {
            alert('Địa chỉ email đã được sử dụng. Xin hãy chọn địa chỉ email khác');
        } else {
            console.log(errorMessage);
        }
        // [END_EXCLUDE]
        console.groupEnd();
    });
    // [END createwithemail]
    hidePopover('register-popover');
}

function isValidated(conditionArr, ...elemArr) {
    let isAllValidated = true;
    for (let condition of conditionArr) {
        // console.log(condition);
        if (condition == 'cannotEmpty') cannotEmpty(elemArr[0]);
        if (condition == 'isEqual') isEqual(elemArr[0], elemArr[1]);
        if (condition == 'isEmail') isEmail(elemArr[0]);
        if (condition == 'isPhoneNumber') isPhoneNumber(elemArr[0]);
        if (condition == 'longerThan6Digit') longerThan6Digit(elemArr[0]);
        if (!isAllValidated) break;
    };
    return isAllValidated;

    function cannotEmpty(elem) {
        if (elem.value == '') {
            // console.log(elem);
            isAllValidated = false;
            elem.nextElementSibling.textContent = 'Trường này không được để trống';
        } else elem.nextElementSibling.textContent = '';
    }

    function isEqual(elem1, elem2) {
        if (elem1.value != elem2.value) {
            isAllValidated = false;
            elem2.nextElementSibling.textContent = 'Nhập lại mật khẩu không khớp';
        } else elem2.nextElementSibling.textContent = '';
    }

    function isEmail(elem) {
        let result = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(elem.value);
        if (!result) {
            isAllValidated = false;
            elem.nextElementSibling.textContent = 'Email bạn nhập phải có định dạng exmaple@example.example'
        } else elem.nextElementSibling.textContent = '';
    }

    function isPhoneNumber(elem) {
        let result = /^[0-9+\- ]+$/.test(elem.value);
        if (!result) {
            isAllValidated = false;
            elem.nextElementSibling.textContent = 'Số điện thoại chỉ có thể chứa các ký tự "0-9 + -" và dấu cách';
        } else elem.nextElementSibling.textContent = '';
    }

    function longerThan6Digit(elem) {
        if (elem.value.length < 6) {
            isAllValidated = false;
            elem.nextElementSibling.textContent = 'Mật khẩu phải dài hơn 6 kí tự';
        } else elem.nextElementSibling.textContent = '';
    }
}