const db = require('../db/conection')

exports.orders = async(req,res)=>{
    const order = db.collection('orders')
    try{
let snapshot = await order.where('sent_cooker',"===", "false").delete()
.then(()=>{
    console.log('Document secssefully')
    res.send('Document secssefully')
}).catch(err=>{
    console.log('error',err)
})
    } 
    catch(err){
        console.log(err)
        res.send({err})
    } 
}