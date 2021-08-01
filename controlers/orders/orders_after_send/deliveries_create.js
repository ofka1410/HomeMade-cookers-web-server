const db = require('../../../db/conection')
const admin = require('../../../admin_firebase')
exports.delivery = async(req,res)=>{
    const order = req.body.items
    const id=req.body.id
    const time = req.body.time
   let full_order;
    let cooker;
    let user;
   try{
      
       console.log(time)
   
    let users= await db.collection('users').doc(order.user_id).get()
    user=users.data()
   
let snapshot= await db.collection('cookers').doc(id).get()
 cooker = snapshot.data()
 
console.log(cooker.vendor)
// snapshot=db.collection('deliveries').add({
//  delivery_price:15,
//  delivery_status:'טסט לא להוציא משלוח!',
//  driver_uid:"",
//  drop_off_adress:order.address||"",
//  drop_off_geo_point:"",
//  drop_off_name:user.name||"",
//  drop_off_phone:user.phone||"",
//  drop_off_timestamp:"",
//  order_id:snapshot.id,
//  pickup_adress:cooker.address||"",
//  pickup_geo_point:'',
//  pickup_name:cooker.vendor||"",
//  pickup_time:cooker.phone_number||"",
//  shipping_id:"",
//  preparation_time:time

// })

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


 res.send({status:'order been sent and approved by cooker'})
   }
   catch(err){
       console.log(err)
       res.send({status:'error',err})
   }
   
}
