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
}).then((response) => {
   
   const my_profile = response.data
 
   const quote={
      sourceCurrency:"ILS",
      targetCurrency:"ILS",
      sourceAmount:data.amount,
      targetAmount:"",
      profile:my_profile[0].id,
      payOut:"BANK_TRANSFER"
   }
   axios.post(' https://api.transferwise.com/v2/quotes', quote,
   {headers:headers})
    .then(async(response)=>{

       console.log(response.data)

       const the_quote=response.data

       const transfer_body={
          profile:my_profile[0].id,
         accountHolderName:data.full_name,
         currency:"ILS",
         type:"israeli_local",
         details:{
            legalType:"PRIVATE",
            IBAN:data.iban.trim()
         }
       }
   //     await axios.get(` https://api.transferwise.com/v1/quotes/${the_quote.id}/account-requirements`, {
   //       headers:headers
   //    }).then((response) => {
   //      console.log(data.response)
   //    }).catch((error) => {
   //    console.log(error)
   //    return res.send({
   //       success:false
   //    })
   // })
         
       axios.post(' https://api.transferwise.com/v1/accounts',transfer_body, 
       {headers:headers})
       .then((response)=>{
         console.log(response.data)
       })
       .catch((error) => {
         console.log(error)
        return res.send({
            success:false
         })
      })

    })

    .catch((error) => {
      console.log(error)
      return res.send({
         success:false
      })
    })

 })

 .catch((error) => {
   console.log(error)
   return res.send({
      success:false
   })
 })
  
}
   
   catch(err){
console.log(err)
res.send({
   success:false
})
   }

}

//IL93 0115 1000 0012 7407 199