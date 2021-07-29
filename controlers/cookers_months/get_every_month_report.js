const db = require('../../db/conection')

exports.every_month = async(req,res)=>{
    const orders_collection = db.collection('orders').where("cooker_sent","==", true)
    const id= req.params.id
    console.log(id)
     let orders=[]
     let all_profits=[]
    
     let all_month=[
         {
            month:1,//"January",
            profit:0
         },
         {
            month:2,//"febuary",
           profit:0
         },
         {
            month:3,//"march",
           profit:0
         },
         {
           month:4,//"april",
            profit:0
         },
         {
            month:5,//"march",
           profit:0
         },
         {
            month:6,//"june",
           profit:0
         },
         {
            month:7,//"july",
            profit:0
         },
         {
           month:8,//"august",
            profit:0
         },
         {
            month:9,//"september",
            profit:0
         },
         {
            month:10,//"september",
           profit:0
         },
         {
         month:11,//"november",
         profit:0
         },
         {
            month:12,//"december",
            profit:0
            
         }]
   
    try{
        let snapshot = await orders_collection.get()
        snapshot.forEach(doc => {
            orders.push({items:doc.data().items ,created_at:doc.data().created_at})
          });
          for(let i=0;i<orders.length;i++){
             if(orders[i].created_at){
               console.log(orders[i].created_at.toDate())
             }
            for(let j=0;j<orders[i].items.length;j++){
                    if(orders[i].items[j].cooker_id === id && orders[i].items[j].ready ==true){
                        let date=orders[i].created_at.toDate()
                        date=date.getMonth()+1
                        
                        for(let z=0;z<all_month.length;z++){
                        if( date == all_month[z].month){
                          all_month[z].profit+=orders[i].items[j].price
                    }
                  }
                }
                }
            }
            all_month.forEach(el=>{
                all_profits.push(el.profit) 
            })
            res.send({all_profits})
    }
    catch(err){
        console.log(err)
        res.send({status:'failed',err})
    }

}