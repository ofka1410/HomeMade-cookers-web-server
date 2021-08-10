const db = require('../../db/conection')

exports.ringtones = async(req,res)=>{
const ringtone = req.body.ringtone
const id = req.body.id
console.log(id)
try{
let snapshot =  db.collection('cookers').doc(id)
let cookers = await snapshot.get()
let cooker={...cookers.data()}
if(cooker.ringtone){
let change= await snapshot.update({
    ringtone:ringtone
})
console.log(change)
 
}
else{
   change= await  snapshot.set({
        ringtone:ringtone
    },{ merge: true }) 
   
}
res.send({status:'צליל התראה שונה בהצלחה'})
}
catch(err){
console.log(err)
res.send({status:'צליל התראה לא שונה. פנו בבקשה לתמיכה טכנית'})
}
}
