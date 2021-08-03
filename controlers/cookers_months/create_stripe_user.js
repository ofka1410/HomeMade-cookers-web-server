const db = require('../../db/conection')
const admin = require('../../admin_firebase')
const Transferwise = require('transferwise');
const TwClient = new Transferwise({
  apiKey: '01234567-890a-bcde-f012-3456789abcde',
});
exports.create_card = async(req,res)=>{
   const idToken = req.body.id
const email = req.body.email

   try{


  

   
}
   catch(err){
console.log(err)
res.send({status:'failed',err})
   }

}