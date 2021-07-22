const db = require('../../db/conection')
require('dotenv').config()
const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

exports.orders = async(req,res)=>{
  const check=req.body
  var orders = [];
  let data;

    
    
      if(check){
        let snapshot = await db.collection("orders").add({
          full_name:check.full_name ||"",
          city:check.city ||"",
          address:check.address,
          phone_number:check.phone_number ||"",
          user_id:check.user_id ||"",
          arrival_time:check.arrival_time ||"",
          created_at:"21.7.2021",
          tip:check.tip||"",
          image:check.image||"",
          total_price:check.total_price||"",
          items:check.items||[],
          comment:check.comment ||"",
          delivery_fee:15,
          sent_cooker:false
          })
      }
          try{
            let all_resevaition=`  מזל טוב, התקבלה הזמנה חדשה! \n ההזמנה מופיעה במלואה באפליקציה וחובה להכנס ולהזין זמן משלוח !.\n\n` 
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
                  to:"+972509128880"//cookers[i].phone_number
                    })
               .then(message => console.log(message.sid));
              
              }
           }

        await client.messages.create({
            body:all_resevaition,
            from: '(952) 260-5618',
            to: "+972509128880"//'+972507915557'
              })
        .then(message => console.log(message.sid));
         await client.messages.create({
          body:all_resevaition,
          from: '(952) 260-5618',
          to:"+972509128880"//'+972509902762'
            })
       .then(message => console.log(message.sid));
        res.send({cookers,all_resevaition,items:data.items})
      
    }
    catch(err){
        console.log(err)
        res.send(err)
    }

}


