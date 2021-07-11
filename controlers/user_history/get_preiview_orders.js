const db = require('../../db/conection')

exports.preview_orders = async(req,res)=>{
    const order = db.collection('orders')
    const id= req.params.id
    let history=[]
    try{
        let snapshot = await order.where("user_id", "===", id).get()
        snapshot.forEach(doc=>{
          history.push({...doc.data(),id:doc.id})
        })
        if(history.length>0){
            res.send({status:'history found',history})
        }
        else{
            res.send({status:'no preiview orders',history})   
        }
    }
   catch(err){
    console.log(err)
    res.send(err)
   }
}