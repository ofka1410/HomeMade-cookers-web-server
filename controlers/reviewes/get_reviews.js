const db = require('../../db/conection')

exports.all_reviews = async(req,res)=>{
    const id= req.params.id
    console.log(id)
    let all_review=[]

    let meals=[]
    try{
        let snapshot = await db.collection('reviews').get()
        snapshot.forEach(doc => {
            date=doc.data().created_at.toDate()
            all_review.push({...doc.data(),id:doc.id,date:date })
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
      
    res.send({status:'success',meals,cooker_reviews:reviews})
    }
    catch(err){
        console.log(err)
        res.send({status:'failed',err})
    }
   
}

