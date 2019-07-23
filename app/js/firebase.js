function autoFillInput() {
    console.group('autoFillInput');
    let elem = document.getElementById('js-user-name');
    if (!elem) {
        console.groupEnd();
        return;
    }
    elem.value = currentUserObj.displayName;
    elem = document.getElementById('js-user-phone');
    elem.value = currentUserObj.phone;
    elem = document.getElementById('js-user-email');
    elem.value = currentUserObj.email;
    console.groupEnd();
}

/**
 * initApp handles setting up UI event listeners and registering Firebase auth listeners:
 *  - firebase.auth().onAuthStateChanged: This listener is called when the user is signed in or
 *    out, and that is where we update the UI.
 */
function initApp() {
    // Listening for auth state changes.
    firebase.auth().onAuthStateChanged(function(user) {
        console.group('firebas.auth.onAuthStateChanged');
        if (user) {
            // User is signed in.
            currentUserObj.isAuthInitialized = true;
            currentUserObj.isLoggedIn = true;
            currentUserObj.email = user.email;
            currentUserObj.photoURL = user.photoURL;
            // get user data from database
            let docRef = db.collection("users").doc(currentUserObj.email);
            // console.log(user);
            docRef.get().then(function(doc) {
                if (doc.exists) {
                    let docData = doc.data();
                    currentUserObj.tourbooked = docData.tourbooked;
                    currentUserObj.oldTours = docData.oldTours;
                    currentUserObj.phone = docData.phone;
                    currentUserObj.displayName = docData.displayName;
                    console.log(JSON.stringify(currentUserObj));
                    autoFillInput();
                } else {
                    // doc.data() will be undefined in this case
                    console.log("No such document!");
                }
            }).catch(function(error) {
                console.log("Error getting document:", error);
            });
            console.log('user sign in');


        } else {
            // User is not logged-in.
            if (!currentUserObj.isAuthInitialized) {
                currentUserObj.isAuthInitialized = true;
            }
            currentUserObj.isLoggedIn = false;
            console.log('user sign not login');
        }
        manageView();
        console.groupEnd();
    });
}

// Your web app's Firebase configuration
let firebaseConfig = {
    apiKey: "AIzaSyBLun8W025GfovROcAH9hiI3XaU8TVM0vY",
    authDomain: "thang-long-tour.firebaseapp.com",
    databaseURL: "https://thang-long-tour.firebaseio.com",
    projectId: "thang-long-tour",
    storageBucket: "",
    messagingSenderId: "686130862617",
    appId: "1:686130862617:web:705408b2e99ddd3d"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// Initialize an instance of Cloud Firestore:
let db = firebase.firestore();

window.onload = function() {
    initApp();
};