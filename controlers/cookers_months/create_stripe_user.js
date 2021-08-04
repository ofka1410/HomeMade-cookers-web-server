const db = require('../../db/conection')
const admin = require('../../admin_firebase')
require('dotenv').config()
const axios = require ('axios')
const { curly } = require('node-libcurl');
exports.create_card = async(req,res)=>{
   try{
    
 const token= process.env.WISE_TOKEN 
 console.log(token)
  const data=await axios.get('https://api.sandbox.transferwise.tech/v1/profilest', {
   headers: {
    "Authorization":token
   }
})

console.log(data)
   
res.send({token:data})

   
}
   
   catch(err){
console.log(err)
res.send({status:'failed',err})
   }

}