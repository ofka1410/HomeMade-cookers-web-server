const db = require('../../db/conection')
const admin = require('../../admin_firebase')
require('dotenv').config()
const axios = require ('axios')
exports.create_card = async(req,res)=>{
   try{
    
 const token= process.env.WISE_TOKEN 
 console.log(token)
  await axios.get(`https://api.sandbox.transferwise.tech/v1/profilest`, {
   headers: {
    "Authorization":`Bearer ${token}`
   }
}).then((res) => {
   console.log(res.data)
 })
 .catch((error) => {
   console.error(error)
 })


   
// res.send({token:data})

   
}
   
   catch(err){
console.log(err)
res.send({status:'failed',err})
   }

}