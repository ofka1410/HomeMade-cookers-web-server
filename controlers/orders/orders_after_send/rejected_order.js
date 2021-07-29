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
      
        let snapshot = await db.collection('orders').doc(id).get()
        full_order={...snapshot.data(),id:snapshot.id}
        let rom_message=`הזמנה לא אושרה\n מספר הזמנה: ${id}\n מספר טלפון של הלקוח: ${full_order.phone}\nסיבת הביטול: ${reason}\n `
        full_order.items.forEach((el,index)=>{
          if(el.cooker_id == token){
            rom_message+=` המנה:${el.name} לא אושרה.\n`
            money+=el.price
            full_order.items.splice(index,-1)
          }
        })
        rom_message+=`הסכום שצריך להחזיר ללקוח: ${money}`
         snapshot = await db.collection('orders').doc(id).update({
            items:full_order.items
        })
        await client.messages.create({
            body:all_resevaition,
            from: '(952) 260-5618',
            to:'+972509128880' //'+972509902762'
              })
         .then(message => console.log(message.sid));
        res.send({status:"succes no error possibly changed"})
        
    }
    catch(err){
console.log(err)
res.send({status:'failed',err})
    }
}