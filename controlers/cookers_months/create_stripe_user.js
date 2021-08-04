const db = require('../../db/conection')
const admin = require('../../admin_firebase')
require('dotenv').config()
exports.create_card = async(req,res)=>{
   try{
 const token= process.env.WISE_TOKEN 
 console.log(token)
   const res = await fetch(`https://api.sandbox.transferwise.tech/v1/profiles\
   -H Authorization: Bearer a9a4bdb5-4521-4728-a031-a1e15e4dc5e`)  
  const data= await res.json()
  console.log(data)
res.send({token:data })
   
}
   catch(err){
console.log(err)
res.send({status:'failed',err})
   }

}