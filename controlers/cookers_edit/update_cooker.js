const db = require('../../db/conection')

exports.update_cooker = async(req,res)=>{
    const cookers = db.collection('cookers')
    const data= req.body
    try{
        let snapshot = await cookers.doc(data.id).update({
            vendor:data.vendor,
            address:data.address,
            phone_number:data.phone_number,
            waze_link:data.waze_link,
            Email:data.email 
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