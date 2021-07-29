const db = require('../../db/conection')
const admin = require('../../admin_firebase')
// env.config({ path: '../../' });
const Stripe = require('stripe')('sk_test_4eC39HqLyjWDarjtT1zdp7dc');
// const stripePublishableKey = process.env.STRIPE_PUBLISHABLE_KEY || "pk_test_51JD9vUKNxjLv3B4pRJDHVewbsn0TYcvuIgH8sz3tCNgwhMzbMORQQ4y7LsvOrqtSDAJJqOGtPs3luMqQs5FIEaLi00I5MfaaNB";
const stripeSecretKey = "sk_test_51JD9vUKNxjLv3B4peEgU37k1Jmo4Ga7UF4ikLG6kx8fT9WAyP6gFAKxz49lbo4xV8cvQ6GefpbjcOOmQhn6hjOr200FKalDdUU"//process.env.STRIPE_SECRET_KEY ||;
// const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";
exports.create_card = async(req,res)=>{
   const card= req.body.details
   const idToken = req.body.id
const email = req.body.email
   try{

  const secret_key = stripeSecretKey;
//   const stripe = new Stripe(secret_key, {
//     apiVersion: "2020-08-27"
//   });

  const customersWithEmail = await Stripe.customers.list({
    email
  });
  let customer = customersWithEmail.data[0]
  if (!customer) {
    customer= await Stripe.customers.create({ email });
  }
  
  const params = {
    amount:500,
    currency:'ILS',
    customer: customer.id,
    payment_method_options: {
        card: {
            request_three_d_secure: "automatic"
          },
      sofort: {
        preferred_language: "en"
      }
    },
    payment_method_types:[]
   
  };
  const paymentIntent = await Stripe.paymentIntents.create(params);
  
   res.send({
    clientSecret:paymentIntent.client_secret,
    status: paymentIntent.status,
    customer:customer
  });
}
   catch(err){
console.log(err)
res.send({status:'failed',err})
   }

}