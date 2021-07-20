const db = require('../db/conection')

exports.changes=async(doc)=>{
    db.collection("orders").doc(doc).onSnapshot((doc) => {
        console.log("Current data: ", doc.data());
        res.send({doc:doc.data()})
    });

}