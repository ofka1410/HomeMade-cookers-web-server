const db = require('../../db/conection')
exports.update_meal = async(req,res)=>{
    const dish = db.collection('meals')
    const data=req.body
try{
   let snapshot = await dish.doc(data.id).update({
        Amount:data.amount,
        Comments:data.comments,
        Product_name:data.Product_name,
        Total_price: data.price * data.amount,
        cart_id:data.cart_id,
        Description:data.description,
        Image:data.image
    })
    let meals=[]
    snapshot = await dish.get()
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