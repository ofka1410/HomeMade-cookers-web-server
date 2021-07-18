const db = require('../../db/conection')

exports.get_dishes = async(req,res)=>{
    const id= req.params.id
    console.log(id)
    const dishes = db.collection('meals')
    let meals=[]
     try{
        let snapshot = await dishes.where('cooker_id',"==",id).get()
        snapshot.forEach(doc => {
            meals.push({...doc.data(),id:doc.id})
          });
          res.send({meals})
     }
     catch(err){
         console.log(err)
         res.send(err)
     }
}