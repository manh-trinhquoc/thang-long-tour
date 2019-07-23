// add include html 
includeHTML().then(() => {
    // Add js library
    console.log('load component cript');
    loadScript('comp/top-nav.js');
    loadScript('comp/header.js');
    loadScript('comp/register-popover.js');
});

(async () => {
    // Add firebase library
    // <!-- The core Firebase JS SDK is always required and must be listed first -->
    await loadScript("https://www.gstatic.com/firebasejs/6.2.4/firebase-app.js");
    // <!-- Add Firebase products that you want to use -->
    await loadScript("https://www.gstatic.com/firebasejs/6.2.4/firebase-auth.js");
    await loadScript("https://www.gstatic.com/firebasejs/6.2.4/firebase-firestore.js");
    // custome xài firebase SDK load cuối 
    await loadScript("js/firebase.js");
})();

<!-- face book chat-->
window.fbAsyncInit = function() {
    FB.init({
        xfbml: true,
        version: 'v3.3'
    });
};

(function(d, s, id) {
    console.log("facebook function");
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s);
    js.id = id;
    js.src = 'https://connect.facebook.net/vi_VN/sdk/xfbml.customerchat.js';
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

// Tạo object lưu thông tin về user
let currentUserObj = {
    isAuthInitialized: false,
    isLoggedIn: false,
    tourbooked: null,
    historyViewed: [],
    oldTours: [],
    displayName: ''
};
// Lấy thông tin về lịch sử duyệt web từ localStorage
console.group('Lấy thông tin về lịch sử duyệt web từ localStorage')
if (localStorage.getItem('historyViewed')) {
    currentUserObj.historyViewed = JSON.parse(localStorage.getItem('historyViewed'));
    // console.log(currentUserObj.historyViewed);
}
// console.log(currentUserObj);
console.groupEnd();