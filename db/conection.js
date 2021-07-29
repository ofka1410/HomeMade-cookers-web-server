const firebase = require("firebase");
require("firebase/firestore");
require("firebase/auth") ;
require("firebase/firestore") ;
require("firebase/storage");
require('dotenv').config()
//conection to dataBase 
var firebaseConfig = {
  apiKey:process.env.API_KEY ,
  authDomain: process.env.AUTH_DOMAIN,
  databaseURL: process.env.DATA_BASE_URL,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env. STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId:process.env.APP_ID,
  measurementId: process.env.MEASUREMENT_ID
};

firebase.initializeApp(firebaseConfig);
 const db = firebase.firestore();
 module.exports= db

