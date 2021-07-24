const db = require('../../db/conection')

exports.sent_cooker = async(req,res)=>{
    const id= req.body.id

    try{
        let snapshot = await db.collection('orders').doc(id).update({
            sent_cooker:true
        })
        res.send('order has been sent sucssefully')
    }
    catch(err){
console.log(err)
res.send({status:'failed',err})
    }
}