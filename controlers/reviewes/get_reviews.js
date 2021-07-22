const db = require('../../db/conection')

exports.all_reviews = async(req,res)=>{
    const id= req.params.id
    console.log(id)
    let all_review=[]

    let meals=[]
    try{
        let snapshot = await db.collection('reviews_testing').get()
        snapshot.forEach(doc => {
            all_review.push({...doc.data(),id:doc.id})
        });
    
        snapshot = await db.collection('meals').where("cooker_id","==",id).get()
    snapshot.forEach(doc => {
        meals.push({...doc.data(),id:doc.id})
    });
   
    let reviews=[]
    all_review.forEach(item=>{
        for(let i=0;i<meals.length;i++){
            console.log(`item id: ${item.meal_id},meal id: ${meals[i].id}`)
            if(item.meal_id == meals[i].id){
            reviews.push({...item,meal_name:meals[i].name})  
            }
        }    
        })
        // reviews.forEach(item=>{
        //     for(let i=0;i<users.length;i++){
        //         if(item.user_id == users[i].id){
        //             item.user_name=
        //         }
        //     }
        // })
    res.send({status:'success',meals,cooker_reviews:reviews})
    }
    catch(err){
        console.log(err)
        res.send({status:'failed',err})
    }
   
}

// {"address":"באפליקציה 13555",
// "city":"har adar",
// "arrival_time":"הכי מהר שאפשר",
// "created_at":"July 17, 2021 at 8:03:23 PM UTC+3",
// "deliveryTime":"July 17, 2021 at 8:48:21 PM UTC+3",
// "full_name":"ofek meiry",
// "delivery_fee":15,
// "items":[
//     {
//       "amount":2,
//         "cooker_id":"8W6svnCwNobtxstnJxvX",
//         "name":"סלט קפרזנה",
//         "price":84
//     },
//      {
//       "amount":2,
//         "cooker_id":"8W6svnCwNobtxstnJxvX",
//         "name":"פיצה זיתי קלמטה",
//         "price":104
//     },
//     {
//       "amount":1,
//         "cooker_id":"ZVIkBOEvbarGHH1jG7dx",
//         "name":"סלמון בעשבי תיבול",
//         "price":68
//     } ,
//        {
//       "amount":1,
//         "cooker_id":"ZVIkBOEvbarGHH1jG7dx",
//         "name":"אורז ודאל - הודי",
//         "price":38
//     },
//      {
//       "amount":1,
//         "cooker_id":"tTL0KZHc6NDlpzReWYQK",
//         "name":"מקרון עוגת גבינה",
//         "price":6
//     }
// ],
// "comment":"בלי עשבי תיבול",
// "phone":"+972509128880",
// "tip":10,
// "total_price":209


// }