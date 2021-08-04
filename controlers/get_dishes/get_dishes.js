const db = require('../../db/conection')
exports.get_dishes = async(req,res)=>{
    const id = req.params.id
    let meals=[]
try{
    let snapshot= await db.collection('meals').where('cooker_id',"==",id).get()
    snapshot.forEach(element => {
        meals.push({...element.data(),id:element.id})
    });
    res.send({meals:meals})
}
catch(err){
    console.log(err)
    res.send({status:'failed error',err})
}
}