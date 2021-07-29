let firebase = require("firebase/app");
require("firebase/auth") ;
require("firebase/firestore") ;
require("firebase/storage");

const firebaseConfig = {
  apiKey: "AIzaSyAoW0U5WOew1gvCl18r2qNHidnjJ3xVwRA",
  authDomain: "data-base-food-ordering-app.firebaseapp.com",
  databaseURL:
    "https://data-base-food-ordering-app-default-rtdb.firebaseio.com",
  projectId: "data-base-food-ordering-app",
  storageBucket: "data-base-food-ordering-app.appspot.com",
  messagingSenderId: "1011228127911",
  appId: "1:1011228127911:web:5b425d5532fd10e1d12182",
  measurementId: "G-D3VVRYBGWH",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app();
}
exports.firebase ;