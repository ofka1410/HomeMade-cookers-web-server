const { resolveSoa } = require('dns')
const db = require('../../db/conection')

exports.get_cooker_details = async(req,res)=>{
    const id= req.params.id
    console.log(id)
    const cookers = db.collection('cookers')
    const stories = db.collection('meals')
    let story=''
    try{
    let snapshot =cookers.doc(id)
    const doc = await snapshot.get()
    if (!doc.exists) {
        console.log('No such document!');
        res.send('No such document!')
      } else {
        console.log('Document data:', doc.data());
        snapshot= await stories.get()
        snapshot.forEach(el=>{
          if(el.data().cooker_id == id){
             story = el.data().story
          }
        })
        res.send({cooker:doc.data(),story})
      }
}
    catch(err){
        console.log(err)
        res.send({status:"failed",err})
    }
}