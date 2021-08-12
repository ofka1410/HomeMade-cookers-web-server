const db = require('../../../db/conection')
exports.user_history = async(req,res)=>{
    const user_id= req.body.user_id
    const token=  req.body.token
    const order_id = req.body.order_id
    let orders=[]
    let preview_order=[]
    console.log(order_id)
try{
let snapshot =await  db.collection('orders').get()
snapshot.forEach(doc => {
    var currentDate = doc.data().created_at.toDate();
       
            orders.push({...doc.data(), id:doc.id,date:currentDate})
        
      
});

orders= orders.filter(el=>el.user_id == user_id)
if(orders.length>0){
    orders.forEach(item=>{
        let filter_arr = item.items.filter(el=>el.cooker_id == token)
        if(filter_arr.length){
         item.items=filter_arr
            preview_order.push(item)
        }
      })
      preview_order = preview_order.filter(el=>el.id!==order_id)
      if( preview_order.length>0){
       
          res.send({status:'לקוח קבוע',preview_order:preview_order})
      }
      else{
        res.send({status:'לקוח חדש',preview_order:[]})   
      }
}
else{
    res.send({status:'לקוח חדש',preview_order:[]})   
}

}
catch(err){
    console.log(err)
    res.send(err)
}
}