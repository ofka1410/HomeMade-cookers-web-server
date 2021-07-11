const db = require('../../db/conection')
exports.add_meal = async(req,res)=>{
    const dish = db.collection('meals')
    const data= req.body
    try{
    
          let snapshot = await dish.add({
            name:el.Name,
            description:data.descripetion,
            ingridients:data.ingridients || null,
            image:data.image,
            price:data.price,
            story:el.Story || null,
            cooker_id:data.cooker_id,
            category_id:data.category_id,
            available:true,
            note:data.note||null,
            reviews:[]
            })
        let meals =[]
        snapshot = await db.collection('meals').get()
snapshot.forEach(doc=>{
meals.push({...doc.data(),id:doc.id})
})
      
    res.send({status:'success',meals})
  }
    catch(err){
      console.log(err)
      res.send('error',err)
    }
   
}