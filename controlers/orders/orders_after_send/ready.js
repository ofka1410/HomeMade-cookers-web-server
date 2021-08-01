const db = require('../../../db/conection')
const admin = require('../../../admin_firebase')
exports.ready = async(req,res)=>{
    const id= req.body.id
    const token = req.body.token
    let full_order;
    try{
        let snapshot = await db.collection('orders').doc(id).get()
        console.log(snapshot.id)
        full_order={...snapshot.data(),id:snapshot.id}
        full_order.items.forEach(el=>{
            console.log(token)
          if(el.cooker_id == token){
              el.ready=true;
          }
        })
         snapshot = await db.collection('orders').doc(id).update({
            items:full_order.items
        })
        .then(() => {
            console.log("Document successfully written!");
           return res.send({status:"succes no error possibly changed"})
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
            return   res.send({status:"failed"})
        });
      
        
    }
    catch(err){
console.log(err)
res.send({status:'failed',err})
    }
}