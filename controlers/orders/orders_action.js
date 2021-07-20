const db = require('../../db/conection')
require('dotenv').config()
const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

exports.orders = async(req,res)=>{
    const data= req.body 
    const order = db.collection('orders')
    db.collection('cookers')
    const timeElapsed = Date.now();
    const today = new Date(timeElapsed);
    try{
        let snapshot = await order.add({
            full_name:data.full_name ||"",
            city:data.city ||"",
            address:data.address,
            phone_number:data.phone_number ||"",
            user_id:data.user_id ||"",
            arrival_time:data.arrival_time ||"",
            created_at:today.toLocaleDateString(),
            tip:data.tip||"",
            image:data.image||"",
            total_price:data.total_price||"",
            items:data.items||[],
            comment:data.comment ||"",
            delivery_fee:15,
            sent_cooker:false
            })
            let all_resevaition=`  מזל טוב, התקבלה הזמנה חדשה! \n ההזמנה מופיעה במלואה באפליקציה וחובה להכנס ולהזין זמן משלוח !.\n\n` 
            all_resevaition+='פרטי משלוח:\n'
            all_resevaition+=`שם:${data.full_name}.\nעיר:${data.city}.\nרחוב:${data.address}.\nמספר טלפון:${data.phone_number}`
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

                if(data.items[j].cooker === cookers[i].id ){
                uniqe_msg += `${[j+1]}.\nשם המנה: ${data.items[j].name}.\nכמות: ${data.items[j].amount}. \nמחיר : ${data.items[j].price}₪.\n\n`
                total_price+=data.items[j].price
               }
              }
              let id=data.items.filter(el=>el.cooker === cookers[i].id)
              if(id.length>0){
                uniqe_msg+=`הערות: ${data.comment ||"אין הערות"}.\n\n`
                uniqe_msg+=`שעת משלוח: ${data.arrival_time}.\n`
                uniqe_msg += `מחיר הזמנה : ${total_price}₪.\n`
                await client.messages.create({
                  body:uniqe_msg,
                  from: '(952) 260-5618',
                  to:cookers[i].phone_number
                    })
               .then(message => console.log(message.sid));
              
              }
           }

      //   await client.messages.create({
      //       body:all_resevaition,
      //       from: '(952) 260-5618',
      //       to:'+972507915557'
      //         })
      //   .then(message => console.log(message.sid));
      //    await client.messages.create({
      //     body:all_resevaition,
      //     from: '(952) 260-5618',
      //     to:'+972509902762'
      //       })
      //  .then(message => console.log(message.sid));
        res.send({cookers,all_resevaition,items:data.items})
      
    }
    catch(err){
        console.log(err)
        res.send(err)
    }

}


// {
//   "full_name":"shaked",
//   "city":"har adar",
//   "address":"mevo hacramin 9",
//   "phone_number":"+972509128880",
//   "user_id":"03tNhutrApONObJDvC62hD6iGEG2",
//   "arrival_time":"13:00",
//   "tip":10,
//   "total_price":225,
//   "comment":"אני רגיש לפטורזיליהת ובלי זיתים על הפיצה, ובלי מיונז",
//   "items":[
//       {
//    "cooker":"ZVIkBOEvbarGHH1jG7dx",
//       "name":"פאד-תאי טבעוני",
//       "amount":2,
//       "price":76
//       },
//        {
//    "cooker":"ZVIkBOEvbarGHH1jG7dx",
//       "name":"ביף בורגיניון",
//       "amount":1,
//       "price":68
//       },
//          {
//    "cooker":"8W6svnCwNobtxstnJxvX",
//       "name":"סלט קפרזה",
//       "amount":2,
//       "price":84
//       },
//             {
//    "cooker":"8W6svnCwNobtxstnJxvX",
//       "name":"פיצה זיתי קלמטה",
//       "amount":2,
//       "price":104
//       },
//                  {
//    "cooker":"5YAYYXpDtMolimZLxvl5",
//       "name":"אינסייד-אאוט טונה",
//       "amount":1,
//       "price":35
//       },
//        {
//    "cooker":"5YAYYXpDtMolimZLxvl5",
//       "name":"אינסייד-אאוט טונה",
//       "amount":1,
//       "price":35
//       }
//       ]
// }
