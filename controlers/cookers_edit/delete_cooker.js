const db = require('../../db/conection')

exports.delete_cooker = async(req,res)=>{
    const cookers = db.collection('cookers')
    const data= req.body
    
    try{
        let deleteItem = await cookers.doc(`${data.id}`).delete().then(()=>{
            console.log('Document secssefully')
        }).catch(err=>{
            console.log('error',err)
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