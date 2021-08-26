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
        let date=doc.data().created_at.toDate()
        
       
        // date= date.
        preview_orders.push({...doc.data(),id:doc.id,date:date})
    });
   
    for(let i=0;i<preview_orders.length;i++){
        for(let j=0;j<preview_orders[i].items.length;j++){
                if(preview_orders[i].items[j].cooker_id == id && preview_orders[i].items[j].ready==true){
                 preview_orders[i].items= preview_orders[i].items.filter(el=>el.cooker_id == id)
                 my_orders.push(preview_orders[i])
                        
                }        
             }
        }
         snapshot = await db.collection('orders').where("cooker_sent","==",true).get()
        snapshot.forEach(doc => {
            let date=doc.data().created_at.toDate()
             let x=doc.data().delivery_time
             var theDate = new Date((x * 1000))
            all_orders.push({...doc.data(),id:doc.id,date:date,delivery:theDate})
        });
        snapshot= await db.collection('cookers').doc(id).get()
        let current_cooker={...snapshot.data()}

        all_orders.forEach(el=>{
            for(let i=0;i<el.items.length;i++){
                let addedTime = false;
                if(el.items[i].cooker_id == id && el.items[i].ready == false){
                    if(!addedTime){
                        el.items= el.items.filter(el=>el.cooker_id == id)
                        const cookerOffset = current_cooker.order_minutes_offset
                        addedTime = true;
                        const cookerDate = new Date(el.delivery.getTime() + (-30+(cookerOffset !== null && cookerOffset !== undefined ?  cookerOffset : 20)) * 60000)
                        el.delivery=cookerDate
                    }
                   
                    if(orders_notReady.length>0){
                       
                        let check= orders_notReady.filter(id=>id.id == el.id)
                        console.log(check)
                        if(!check.length){
                          orders_notReady.push(el)
                       } 
                         
                    }
                    else{
                        orders_notReady.push(el)   
                    }
                 
                     
                }
            }
        })
     
        console.log( orders_notReady.length)
        res.send({orders_notReady,my_orders})
    }
catch(err){
    console.log(err)
    res.send({status:'failed',err})
}
}