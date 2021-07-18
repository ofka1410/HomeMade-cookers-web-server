const db = require('../../db/conection')

exports.change_dishes = async(req,res)=>{
const id = req.body.id
const dishes = db.collection('meals')
let meals=[]
try{
    let snapshot =  dishes.doc(id)
     let doc = await snapshot.get()
     if (!doc.exists) {
        console.log('No such document!');
        res.send('No such document!')
      } else {
       if(doc.data().available == true){
         snapshot = await snapshot.update({
            available:false
        })
      
       let result = await db.collection('meals').where('cooker_id',"==",id).get()
       result.forEach(doc => {
            meals.push({...doc.data(),id:doc.id})
          });
        res.send({status:'sucsses, avialable changed to false',meals}) 
       }
       else{
       snapshot = await snapshot.update({
            available:true
        })
       
      let result = await db.collection('meals').where('cooker_id',"==",id).get()
      
        result.forEach(doc => {
            meals.push({...doc.data(),id:doc.id})
          });
        res.send({status:'sucsses, avialable changed to true',meals}) 
       }
      }
}

catch(err){
    console.log(err)
    res.send(err)
}
}