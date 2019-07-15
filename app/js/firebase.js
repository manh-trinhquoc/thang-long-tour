// Your web app's Firebase configuration
var firebaseConfig = {
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
            currentUserObj.isLoggedIn = true;
            currentUserObj.displayName = user.displayName;
            currentUserObj.email = user.email;
            currentUserObj.photoURL = user.photoURL;
            // get user data from database
            let docRef = db.collection("users").doc(currentUserObj.email);

            docRef.get().then(function(doc) {
                if (doc.exists) {
                    let docData = doc.data()
                    // console.log("Document data:", docData);
                    currentUserObj.historyViewed = docData.historyViewed;
                    currentUserObj.tourbooked = docData.tourbooked;
                    currentUserObj.oldTours = docData.oldTours;
                } else {
                    // doc.data() will be undefined in this case
                    console.log("No such document!");
                }
            }).catch(function(error) {
                console.log("Error getting document:", error);
            });
            console.log('user sign in');
            console.log(JSON.stringify(currentUserObj));
            manageView();
        } else {
            // User is signed out.
            if (!currentUserObj.isAppInitialized) {
                currentUserObj.isAppInitialized = true;
                console.groupEnd();
                return;
            }
            currentUserObj.isLoggedIn = false;
            currentUserObj.email = '';
            currentUserObj.photoURL = '';
            currentUserObj.historyViewed = '';
            currentUserObj.tourbooked = ''
            currentUserObj.oldTours = '';
            console.log('user sign out');
            console.log(currentUserObj);
            window.localStorage.clear();
            manageView();
        }

        console.groupEnd();
    });
}

window.onload = function() {
    initApp();
};
// Initialize an instance of Cloud Firestore:
var db = firebase.firestore();