const db = require('../../../db/conection')
const admin = require('../../../admin_firebase')
exports.delivery = async(req,res)=>{
    const order = req.body.items
    const id=req.body.id
   let full_order;
    let user_id= req.body.user_id
   try{
      
      
   
       let snapshot= await db.collection('cookers').doc(id).get()
       let cooker = {...snapshot.data(),id:snapshot.id}
     snapshot= await db.collection('users').doc(user_id).get()
     let user= snapshot.data()
  snapshot = await db.collection('orders').doc(order.id).get()
  
full_order={...snapshot.data(),id:snapshot.id}
if(full_order.approved){
    console.log('you inside')
full_order.approved.push(cooker.id)
snapshot = await db.collection('orders').doc(order.id).update({
    approved:full_order.approved
})
}
else{
    db.collection('orders').doc(order.id).set({
        approved:[id]  
    },{ merge: true }) 
}

console.log(user,cooker)
 res.send({status:'order been sent and approved by cooker',cooker:cooker,user:user})
   }
   catch(err){
       console.log(err)
       res.send({status:'error',err})
   }
   
}
