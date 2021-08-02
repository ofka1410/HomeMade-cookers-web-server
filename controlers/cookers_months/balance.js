const db = require('../../db/conection')
const admin = require('../../admin_firebase')
env.config({ path: "../.env" });

const stripePublishableKey = process.env.STRIPE_PUBLISHABLE_KEY || "pk_test_51JD9vUKNxjLv3B4pRJDHVewbsn0TYcvuIgH8sz3tCNgwhMzbMORQQ4y7LsvOrqtSDAJJqOGtPs3luMqQs5FIEaLi00I5MfaaNB";
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || "sk_test_51JD9vUKNxjLv3B4peEgU37k1Jmo4Ga7UF4ikLG6kx8fT9WAyP6gFAKxz49lbo4xV8cvQ6GefpbjcOOmQhn6hjOr200FKalDdUU";
const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";
exports.balance = async(req,res)=>{
    const { email } = req.body.email;
    const idToken = req.body.token;
    const id= req.body.id
    const sum = req.body.sum;
    // const user = await admin.auth().verifyIdToken(idToken);
    console.log(email);
    console.log(user.email);
    if (email !== user.email) {
        return res.status(401).send({error: "Unauthorized"});
      }

    const transfer = await stripe.transfers.create({
        amount:sum*10,
        currency: 'ILS',
        destination: user.id,
      });
      if(transfer){
          let snapshot = await db.collection('cookers').doc(id).update({
            cash_withrawal:sum+snapshot.data().cash_withrawal
          })
          
        return res.status(401).send({error: "Unauthorized"}); 
      }
}