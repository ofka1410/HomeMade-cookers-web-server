const db = require('../../db/conection')
const admin = require('../../admin_firebase')
exports.change_all = async(req,res)=>{
    const id = req.body.id
    const available= req.body.available
    let my_meals = []
    try{
        let snapshot = await db.collection('meals').where("cooker_id","==",id).get()
        snapshot.forEach(doc => {
            my_meals.push({items:doc.data().items ,id:doc.id})
          });
          if(available=='available'){
            my_meals.forEach(async(item)=>{
                snapshot = await snapshot.doc(item.id).update({
                    available:true
                })
              })
          }
          else{
            my_meals.forEach(async(item)=>{
                snapshot = await snapshot.doc(item.id).update({
                    available:false
                })
              })   
          }
          res.send({status:'changed'})
         
    }
    catch(err){
        console.log(err)
        res.send({status:'err',err})
    }
   
}

