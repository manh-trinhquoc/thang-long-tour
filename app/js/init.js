// Add js library
dynamicallyLoadScript('comp/top-nav.js')
dynamicallyLoadScript('comp/header.js')
dynamicallyLoadScript('comp/register-popover.js')

// add include html 
includeHTML();

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