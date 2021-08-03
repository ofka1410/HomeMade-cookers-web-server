const db = require('../../db/conection')
const admin = require('../../admin_firebase')
require('dotenv').config()
exports.create_card = async(req,res)=>{
   try{
 const token= process.env.WISE_TOKEN 
 console.log(token)
//    const res = await fetch(`https://api.sandbox.transferwise.tech/v1/profiles \
//    -H Authorization: Bearer ${token}`)  
//   const data= await res.json()
res.send({token:process.env.WISE_TOKEN })
   
}
   catch(err){
console.log(err)
res.send({status:'failed',err})
   }

}