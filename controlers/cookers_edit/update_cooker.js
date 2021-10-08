const db = require('../../db/conection')
const admin = require('../../admin_firebase')
exports.update_cooker = async(req,res)=>{
    const cookers = db.collection('cookers')
    const data= req.body

    try{
        console.log(data.phone_number)
        let snapshot = await cookers.doc(data.id).update({
            address:data.address,
            phone_number:data.phone_number,
            Email:data.email,
            about:data.story,
            working_hours:data.cooker_working
        })
        

 let cookers_update=[]
snapshot = await db.collection('cookers').get()
snapshot.forEach(doc=>{
    cookers_update.push({...doc.data(),id:doc.id})
})

res.send({status:'success',cookers_update})

    }
    catch(err){
    console.log(err)
    res.send({stauts:'err',err})
    }
}