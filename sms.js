const db= require('./db/conection')
const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
const sent_cooker = require('./controlers/orders/sent_cooker')
exports.sms= async(data)=>{
    try{
      var minutesToAdd=10;
var currentDate = new Date(data.delivery_time);
var futureDate = new Date(currentDate.getTime() - minutesToAdd*60000);
      
      // let x=data.delivery_time
       theDate = new Date(futureDate* 1000)
        let all_resevaition=`  מזל טוב, התקבלה הזמנה חדשה! \n ההזמנה מופיעה במלואה באפליקציה וחובה להכנס ולהזין זמן משלוח !.\n\n` 
        all_resevaition+=` ההזמנה לתאריך:${new Date(theDate).toLocaleString(undefined,{
          month: "long", day: "numeric", 
          hour: "numeric", minute:"numeric"})}\n` 
        all_resevaition+='פרטי משלוח:\n'
        all_resevaition+=`שם:${data.full_name ||"לא נשלח שם"}.\nעיר:${data.city ||"לא צוין עיר"}.\nרחוב:${data.address}.\nמספר טלפון:${data.phone||"לא נשלח מספר"}`
        for(let i=0;i<data.items.length;i++){
            all_resevaition= all_resevaition =all_resevaition + `${[i+1]}.\nשם המנה: ${data.items[i].name}. כמות: ${data.items[i].amount}.\nמחיר סופי: ${data.items[i].price}₪.\n`
             }
             all_resevaition+=`הערות לטבח: ${data.comment ||"אין הערות"}.\n\n`
             all_resevaition+= `שעת משלוח: ${data.arrival_time}.\n`
             all_resevaition+= `מחיר ההזמנה: ${data.total_price}.\n`
        let cookers=[]
         snapshot = await db.collection('cookers').get()
        snapshot.forEach(doc=>{
          cookers.push({...doc.data(),id:doc.id})
        })
        
      
        
      for(let i=0;i<cookers.length;i++){
   
        let total_price=0
        let uniqe_msg='  מזל טוב, התקבלה הזמנה חדשה! \n ההזמנה מופיעה במלואה באפליקציה וחובה להכנס ולהזין זמן משלוח !.\n\n'
         uniqe_msg+= `: ההזמנה לתאריך ${new Date(theDate).toLocaleString(undefined,{
          month: "long", day: "numeric", 
          hour: "numeric", minute:"numeric"})}\n` 
          for(let j=0;j<data.items.length;j++){
           
            if(data.items[j].cooker_id === cookers[i].id ){
            uniqe_msg += `${[j+1]}.\nשם המנה: ${data.items[j].name}.\nכמות: ${data.items[j].amount}. \nמחיר : ${data.items[j].price}₪.\n\n`
            total_price+=data.items[j].price
           }
          }
          let id=data.items.filter(el=>el.cooker_id === cookers[i].id)
          if(id.length>0){
            uniqe_msg+=`הערות: ${data.comment ||"אין הערות"}.\n\n`
            uniqe_msg+=`שעת משלוח: ${data.arrival_time}.\n`
            uniqe_msg += `מחיר הזמנה : ${total_price}₪.\n`
            await client.messages.create({
              body:uniqe_msg,
              from:'(952) 260-5618',
              to:"+972509128880"
                })
           .then(message => console.log(message.sid));
          }
       }

    await client.messages.create({
        body:all_resevaition,
        from: '(952) 260-5618',
        to:"+972509128880"
          })
    .then(message => console.log(message.sid));
  //    await client.messages.create({
  //     body:all_resevaition,
  //     from: '(952) 260-5618',
  //     to:'+972509902762'
  //       })
  //  .then(message => console.log(message.sid));
    // res.send({cookers,all_resevaition,items:data.items})
  console.log('sms been send')
   snapshot = await db.collection('orders').doc(data.id).update({
    cooker_sent:true
})
}
catch(err){
    console.log(err)
}
}
