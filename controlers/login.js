const db = require('../db/conection')

exports.login = async(req,res)=>{
const email = req.body.email
let id;
try{
    console.log('im in')
    console.log(email)
    let snapshot = await db.collection('cookers').get()
    snapshot.forEach(element => {
        if(element.data().Email == email){
           id=element.id
        }
        
    });
    res.send({id:id})
     

}
catch(err){
    console.log(err)
    res.send({status:'err',err})
}
}