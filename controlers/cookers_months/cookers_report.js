const db = require('../../db/conection')

exports.report = async(req,res)=>{
    //variabels
    const id= req.body.id 
    console.log(id)
    let month= req.body.month
    let orders=[]
    var date  = new Date();
    var current_month = date.getMonth();
    const orders_collection = db.collection('orders')
    let cooker_orders=[]
    let orders_current_month=[]
    let counter_meals_month=0
    let counter_allMeals=0
    if(month !==""){
    let monthName = month;
    let monthNumber = new Date(monthName + " 1").getMonth() + 1;
    month=monthNumber;
    }
    else{
        month=''
    }
    try{
        console.log(month)
        let snapshot = await orders_collection.where("cooker_sent","==", true).get()
        snapshot.forEach(doc => {
            orders.push({items:doc.data().items ,created_at:doc.data().created_at})
          });
          //check if admin search for specific month report
            if(month!==''){
                for(let i=0;i<orders.length;i++){
                    for(let j=0;j<orders[i].items.length;j++){
                     if(orders[i].items[j].cooker_id === id &&orders[i].items[j].ready ==true ){
                        let date=orders[i].created_at.toDate()
                        date=date.getMonth()+1
                          if(date== month){
                                orders_current_month.push({...orders[i].items[j],date:orders[i].created_at.toDate()})
                                counter_meals_month+=1
                        }
                        cooker_orders.push({...orders[i].items[j],date:orders[i].created_at})
                        counter_allMeals+=1
                        }
                        
                        }
                    }
                    let month_profit= orders_current_month.reduce(function(month_profit, current) {
                        return month_profit + parseInt(current.price* current.amount *0.7);
                      }, 0); 
                      month_profit += '₪'

                      let total_profit= cooker_orders.reduce(function(total_profit, current) {
                        return total_profit + parseInt(current.price* current.amount *0.7);
                      }, 0); 
                      total_profit += '₪'
                           
                           
                      res.send({status:'success',orders_current_month,month_profit, month:req.body.month,total_profit,counter_meals_month,counter_allMeals})
            }
            //default report
            else{
                for(let i=0;i<orders.length;i++){
                    for(let j=0;j<orders[i].items.length;j++){
                        
                     if(orders[i].items[j].cooker_id === id &&orders[i].items[j].ready ==true){
                        let date=orders[i].created_at.toDate()
                        date=date.getMonth()+1
                         if( date[1]== current_month+1){
                             orders_current_month.push({...orders[i].items[j],date:orders[i].date})
                             counter_meals_month+=1
                         }
                         cooker_orders.push({...orders[i].items[j],date:orders[i].created_at})
                         counter_allMeals+=1
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
                all_orders:cooker_orders,total_profit,orders_current_month,month_profit,counter_meals_month,counter_allMeals})
            }    
    }
    catch(err){
        console.log(err)
        res.send({status:'err',err})
    }
    
}


