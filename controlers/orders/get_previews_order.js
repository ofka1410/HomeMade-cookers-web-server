const db = require('../../db/conection')


exports.preview_orders = async(req,res)=>{
const id= req.params.id
console.log(id)
 
let my_orders=[]
let all_orders=[]
let orders_notReady=[]
let preview_orders=[]
try{
    let snapshot = await db.collection('orders').where("cooker_sent","==",true).get()
    snapshot.forEach(doc => {
        preview_orders.push({...doc.data(),id:doc.id})
    });
   
    for(let i=0;i<preview_orders.length;i++){
        for(let j=0;j<preview_orders[i].items.length;j++){
                if(preview_orders[i].items[j].cooker_id == id && preview_orders[i].items[j].ready){
                 console.log('inside')
                 preview_orders[i].items= preview_orders[i].items.filter(el=>el.cooker_id == id)
                 my_orders.push(preview_orders[i])
                        
                }
                       
             }
           
        }
         snapshot = await db.collection('orders').where("cooker_sent","==",true).get()
        snapshot.forEach(doc => {
            all_orders.push({...doc.data(),id:doc.id})
        });

        all_orders.forEach(el=>{
            for(let i=0;i<el.items.length;i++){
                if(el.items[i].cooker_id == id && el.items[i].ready == false){
                    el.items= el.items.filter(el=>el.cooker_id == id)
                    orders_notReady.push(el)
                    
                }
            }
        })
        res.send({orders_notReady,my_orders})
    }
catch(err){
    console.log(err)
    res.send({status:'failed',err})
}

}