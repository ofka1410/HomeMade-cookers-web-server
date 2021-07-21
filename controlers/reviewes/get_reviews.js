const db = require('../../db/conection')

exports.all_reviews = async(req,res)=>{
    const id= req.params.id
    let all_review=[]
    let cooker_reviews=[]
    let meals=[]
    try{
        let snapshot = await db.collection('reviews_testing').get()
        snapshot.forEach(doc => {
            all_orders.push({...doc.data(),id:doc.id})
        });
    
        snapshot = await db.collection('meals').where("cooker_id","===",id).get()
    snapshot.forEach(doc => {
        meals.push({...doc.data(),id:doc.id})
    });
    }
   
}
