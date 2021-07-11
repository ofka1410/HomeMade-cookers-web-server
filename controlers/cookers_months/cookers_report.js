const db = require('../../db/conection')

exports.report = async(req,res)=>{
    //variabels
    const id= req.body.id 
    let month= req.body.month
    let orders=[]
    var date  = new Date();
    var current_month = date.getMonth();
    const orders_collection = db.collection('orders')
    let cooker_orders=[]
    let orders_current_month=[]
    if(month !=="" && month.length>1){
    let monthName = month;
    let monthNumber = new Date(monthName + " 1").getMonth() + 1;
    month=monthNumber;
    }
    else{
        month=''
    }
    try{
        let snapshot = await orders_collection.get()
        snapshot.forEach(doc => {
            orders.push({items:doc.data().items ,date:doc.data().created_at})
          });
          //check if admin search for specific month report
            if(month!==''){
                for(let i=0;i<orders.length;i++){
                    for(let j=0;j<orders[i].items.length;j++){
                     if(orders[i].items[j].cooker === id){
                         let date=orders[i].date.split('.')
                          if( date[1]== month){
                            orders_current_month.push({...orders[i].items[j],date:orders[i].date})
                        }
                        }
                        }
                    }
                    let month_profit= orders_current_month.reduce(function(month_profit, current) {
                        return month_profit + parseInt(current.price);
                      }, 0); 
                      month_profit += '₪'
            
                      res.send({status:'success',orders_current_month,month_profit, month:req.body.month})
            }
            //default report
            else{
                for(let i=0;i<orders.length;i++){
                    for(let j=0;j<orders[i].items.length;j++){
                     if(orders[i].items[j].cooker === id){
                         let date=orders[i].date.split('.')
                         
                         if( date[1]== current_month+1){
                             orders_current_month.push({...orders[i].items[j],date:orders[i].date})
                         }
                         cooker_orders.push({...orders[i].items[j],date:orders[i].date})
       
                        }
                    }  
                }
                //profit of all reservation
                let total_profit= cooker_orders.reduce(function(total_profit, current) {
                 return total_profit + parseInt(current.price);
               }, 0); 
               total_profit += '₪'
     
               //profit from current mounth
     
               let month_profit= orders_current_month.reduce(function(month_profit, current) {
                 return month_profit + parseInt(current.price);
               }, 0); 
               month_profit += '₪'
     
               res.send({status:'success',
                all_orders:cooker_orders,total_profit,orders_current_month,month_profit})
            }
           
    }
    catch(err){
        console.log(err)
        res.send({status:'err',err})
    }
    
}


