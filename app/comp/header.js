function togglePopover(id) {
    let elePopover = document.getElementById(id);
    elePopover.toggleAttribute("hidden");
}

function toggleRegisterDropdown() {
    document.getElementById('register-dropdown').toggleAttribute('hidden');
}

function signOut() {
    console.group('signOut');
    firebase.auth().signOut().then(function() {
        // Sign-out successful.
        console.log('Sign-out successful.');
        currentUserObj.isLoggedIn = false;
        currentUserObj.email = '';
        currentUserObj.photoURL = '';
        currentUserObj.historyViewed = '';
        currentUserObj.tourbooked = ''
        currentUserObj.oldTours = '';
        // thay thế nút bấm
        manageView();
    }).catch(function(error) {
        // An error happened.
        console.log('Sign-out error');
        console.log(error)
    });
    console.groupEnd();
    toggleRegisterDropdown();


}