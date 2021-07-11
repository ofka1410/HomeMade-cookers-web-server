const db = require('../../db/conection')
exports.delete_meal = async(req,res)=>{
    const dish = db.collection('meals')
    const data= req.body
try{
    let deleteItem = await dish.doc(`${data.id}`).delete().then(()=>{
        console.log('Document secssefully')
    }).catch(err=>{
        console.log('error',err)
    })
    let meals=[]
    let snapshot = await cart_productRef.where("cart_id","==", data.cart_id).get()
    snapshot.forEach(doc => {
      meals.push({...doc.data(),id:doc.id})
     });
     res.send({status:'success',meals})
}
catch(err){
    console.log(err)
    res.send({status:'err',err})
}

    
}