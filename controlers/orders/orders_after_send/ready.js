const db = require('../../../db/conection')

exports.ready = async(req,res)=>{
    const id= req.body.id
    const token = req.body.token
    let full_order
    try{
        let snapshot = await db.collection('orders').doc(id).get()
     
        full_order={...snapshot.data(),id:snapshot.id}
        full_order.items.forEach(el=>{
          if(el.cooker_id == token){
              el.ready= true;
          }
        })
         snapshot = await db.collection('orders').doc(id).update({
            items:full_order.items
        })
        res.send({status:"succes no error possibly changed"})
        
    }
    catch(err){
console.log(err)
res.send({status:'failed',err})
    }
}