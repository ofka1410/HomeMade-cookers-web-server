const  admin = require('firebase-admin');
var serviceAccount = require("./data-base-food-ordering-app-firebase-adminsdk-ooji4-d4f9914dcd.json");

exports.administrator=admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://data-base-food-ordering-app-default-rtdb.firebaseio.com"
});