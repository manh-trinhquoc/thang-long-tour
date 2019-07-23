function togglePopover(id) {
    let elePopover = document.getElementById(id);
    elePopover.toggleAttribute("hidden");
}

function toggleRegisterDropdown() {
    document.getElementById('register-dropdown').toggleAttribute('hidden');
}

function clearCurrentUserInfo() {
    currentUserObj.isLoggedIn = false;
    currentUserObj.email = '';
    currentUserObj.photoURL = '';
    currentUserObj.historyViewed = '';
    currentUserObj.tourbooked = ''
    currentUserObj.oldTours = '';
}

function signOut() {
    console.group('signOut');
    firebase.auth().signOut().then(function() {
        // Sign-out successful.
        // user infomation vào database của firebase để update thông historyViewde
        db.collection("users").doc(currentUserObj.email).set(currentUserObj).then(function() {
            console.log(`Bạn ${currentUserObj.displayName} đã cập nhật thông tin user trên database`);
        }).catch(function(error) {
            console.error("Error modify document: ", error);
        });
        console.log('Sign-out successful.');
        clearCurrentUserInfo();
        window.localStorage.clear();
        location.reload(true);
    }).catch(function(error) {
        // An error happened.
        console.log('Sign-out error');
        console.log(error)
    });
    console.groupEnd();
    toggleRegisterDropdown();
}

function executeQuery() {
    var input = document.getElementById('cse-search-input-box-id');
    var element = google.search.cse.element.getElement('searchresults-only0');
    if (input.value == '') {
        element.clearAllResults();
    } else {
        element.execute(input.value);
    }
    return false;
}

loadScript('https://cse.google.com/cse.js?cx=017304219906317488510:iiffvytem58', false, true);