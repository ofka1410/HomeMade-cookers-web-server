const db = require('../../db/conection')

exports.update_cooker = async(req,res)=>{
    const cookers = db.collection('cookers')
    const data= req.body
    const story = db.collection('cookers')
    try{
        let snapshot = await cookers.doc(data.id).update({
            address:data.address,
            phone_number:data.phone_number,
            Email:data.email 
        })
        

 let cookers_update=[]
snapshot = await db.collection('cookers').get()
snapshot.forEach(doc=>{
    cookers_update.push({...doc.data(),id:doc.id})
})
snapshot= story.where('cooker_id',"==", data.id).update({
    story:data.story
})
res.send({status:'success',cookers_update})

    }
    catch(err){
    console.log(err)
    res.send({stauts:'err',err})
    }
}