const db = require('../../db/conection')
const { orders } = require('./orders_action')

exports.preview_orders = async(req,res)=>{
const id= req.params.id
console.log(id)
 
let my_orders=[]
let all_orders=[]
try{
    let snapshot = await db.collection('orders').get()
    snapshot.forEach(doc => {
        all_orders.push({...doc.data(),id:doc.id})
    });
   
    for(let i=0;i<all_orders.length;i++){
        for(let j=0;j<all_orders[i].items.length;j++){
            console.log(all_orders[i].items[j].cooker_id)
            if(all_orders[i].items[j].cooker_id !== undefined){
                if(all_orders[i].items[j].cooker_id == id){
                 console.log('inside')
                    //let check = my_orders.find(el=>el.id == all_orders.id)
                   
                       
                        //if(check){
                            my_orders.push(all_orders[i])
                       // }
            }
            
             }
           
        }
    }
    res.send({status:'succsess',my_orders})
}
catch(err){
    console.log(err)
    res.send({status:'failed',err})
}

}