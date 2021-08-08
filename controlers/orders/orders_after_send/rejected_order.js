const db = require('../../../db/conection')
const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
exports.rejected = async(req,res)=>{
    const id= req.body.id
    const token = req.body.token
    const reason = req.body.reason
    let money=0
    let full_order
    try{
      let snapshot = await db.collection('orders').doc(order_id).get()
      let full_order={...snapshot.data(),id:snapshot.id}
      full_order.items.forEach(el=>{
        if(el.cooker_id == token){
          el.cooker_id= "bikkee8j3raHBlaFUkr3"
        }
      })
      snapshot = await db.collection('orders').doc(order_id).update({
        items: full_order.items
          })
     
    }
    catch(err){
console.log(err)
res.send({status:'failed',err})
    }
}