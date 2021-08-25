const db = require('../../db/conection')
const admin = require('../../admin_firebase')
require('dotenv').config()
const axios = require ('axios')
exports.create_card = async(req,res)=>{
   try{
    const data= req.body
 const token= process.env.WISE_TOKEN 
 const headers={"Authorization":`Bearer ${token}`}
 console.log(token)
  await axios.get(` https://api.transferwise.com/v1/profiles`, {
   headers:headers
}).then((res) => {
   
   const my_profile = res.data
 
   const quote={
      sourceCurrency:"ILS",
      targetCurrency:"ILS",
      sourceAmount:100,
      targetAmount:"",
      profile:my_profile[0].id
   }
   axios.post(' https://api.transferwise.com/v2/quotes', quote,
   {headers:headers})
    .then((res)=>{

       console.log(res.data)

       const the_quote=res.data

       const transfer_body={
         currency:"ILS",
         type: "IBAN",
         profile:my_profile[0].id,
         accountHolderName:data.full_name,
         legalType:"PRIVATE",
         details: { 
            sortCode: 231470, 
            accountNumber: data.acountNumber
         } 
       }
       axios.post(' https://api.transferwise.com/v2/quotes', 
       {headers:headers})
    })
    .catch((error) => {
      console.error(error)
    })

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