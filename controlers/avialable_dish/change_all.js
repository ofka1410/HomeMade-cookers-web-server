const db = require('../../db/conection')
const admin = require('../../admin_firebase')
exports.change_all = async(req,res)=>{
    const id = req.body.id
    const available= req.body.available
    let my_meals = []
    let newArr=[]
    const idToken = req.auth;
    console.log( req.auth)
    try{
      const user = await admin.auth().verifyIdToken(idToken);
        let snapshot = await db.collection('meals').where("cooker_id","==",id).get()
        snapshot.forEach(doc => {
            my_meals.push({...doc.data() ,id:doc.id})
          });
          if(available=='available'){
            my_meals.forEach(async(item)=>{
             await db.collection('meals').doc(item.id).update({
                    available:true
                })
              })
          }
          else{
            my_meals.forEach(async(item)=>{
               await db.collection('meals').doc(item.id).update({
                    available:false
                })
              })   
          }
           snapshot = await db.collection('meals').where("cooker_id","==",id).get()
          snapshot.forEach(doc => {
              if(available=='available' && doc.data().available){
                newArr.push({...doc.data() ,id:doc.id})
              }
              else if(available=='not_available' && !doc.data().available){
                newArr.push({...doc.data() ,id:doc.id})
              }
            })
            
          res.send({status:'changed',newArr})
         
    }
    catch(err){
        console.log(err)
        res.send({status:'err',err})
    }
   
}

