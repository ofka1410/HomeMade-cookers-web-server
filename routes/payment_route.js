const env = require("dotenv");
env.config({ path: "../.env" });
const bodyParser = require("body-parser");
const express = require("express");
const Stripe = require("stripe");
const  admin = require('firebase-admin');
const router = express.Router();

var serviceAccount = require("../data-base-food-ordering-app-firebase-adminsdk-ooji4-d4f9914dcd.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://data-base-food-ordering-app-default-rtdb.firebaseio.com"
});

const stripePublishableKey = process.env.STRIPE_PUBLISHABLE_KEY || "pk_test_51JD9vUKNxjLv3B4pRJDHVewbsn0TYcvuIgH8sz3tCNgwhMzbMORQQ4y7LsvOrqtSDAJJqOGtPs3luMqQs5FIEaLi00I5MfaaNB";
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || "sk_test_51JD9vUKNxjLv3B4peEgU37k1Jmo4Ga7UF4ikLG6kx8fT9WAyP6gFAKxz49lbo4xV8cvQ6GefpbjcOOmQhn6hjOr200FKalDdUU";
const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";


router.route("/").get((req, res) => {
  res.send({ "Welome to": "Just that" });
});

const calculateOrderAmount = _order => {
  // Calculate the order total on the server to prevent
  // people from directly manipulating the amount on the client.
  return 1400;
};

function getKeys(payment_method) {
  let secret_key = stripeSecretKey;
  let publishable_key = stripePublishableKey;

  switch (payment_method) {
    case "grabpay":
    case "fpx":
      publishable_key = process.env.STRIPE_PUBLISHABLE_KEY_MY;
      secret_key = process.env.STRIPE_SECRET_KEY_MY;
      break;
    case "au_becs_debit":
      publishable_key = process.env.STRIPE_PUBLISHABLE_KEY_AU;
      secret_key = process.env.STRIPE_SECRET_KEY_AU;
      break;
    case "oxxo":
      publishable_key = process.env.STRIPE_PUBLISHABLE_KEY_MX;
      secret_key = process.env.STRIPE_SECRET_KEY_MX;
      break;
    default:
      publishable_key = stripePublishableKey;
      secret_key = stripeSecretKey;
  }

  return { secret_key, publishable_key };
}

router.route("stripe-key").get((req, res) => {
  const { publishable_key } = getKeys(req.query.paymentMethod);

  res.send({ publishableKey: publishable_key });
});
router.route("/payment-methods").get(async (req, res) => {
    const { email } = req.query;
    const idToken = req.headers.token;
    const user = await admin.auth().verifyIdToken(idToken);
    console.log(email);
    console.log(user.email);
    if (email !== user.email) {
      return res.status(401).send({error: "Unauthorized"});
    }
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2020-08-27"
    });
    const customersWithEmail = await stripe.customers.list({
      email
    });
    let customer = customersWithEmail.data[0]
    if (!customer) {
      return res.status(401).send({error: "Unauthorized"});
    } 
    const paymentMethod = await stripe.paymentMethods.list({
      customer: customer.id,
      type: "card",
    });
    const cards = paymentMethod.data.map(method => {
      if (method.type && method.type === 'card') {
        return {customer: method.customer, card: method.card, id: method.id}
      }
    });
    return res.send({cards});
});
router.route("/create-payment-intent").post(async (req, res) => {
  const {
    email,
    amount,
    currency,
    request_three_d_secure,
    payment_method_types = [],
    card_id
  } = req.body;
  const idToken = req.headers.token;
  const user = await admin.auth().verifyIdToken(idToken);
  if (email !== user.email) {
    return res.status(401).send({error: "Unauthorized"});
  }
  const secret_key = stripeSecretKey;
  const stripe = new Stripe(secret_key, {
    apiVersion: "2020-08-27"
  });

  const customersWithEmail = await stripe.customers.list({
    email
  });
  let customer = customersWithEmail.data[0]
  if (!customer) {
    customer = await stripe.customers.create({ email });
  }
  // Create a PaymentIntent with the order amount and currency.
  const params = {
    amount: amount*100 | 0,
    currency,
    customer: customer.id,
    payment_method_options: {
      card: {
        request_three_d_secure: request_three_d_secure || "automatic"
      },
      sofort: {
        preferred_language: "en"
      }
    },
    payment_method_types: payment_method_types
  };
  if (card_id) {
    params.payment_method = card_id;
    params.confirm = true;
  }
  try {
    const paymentIntent = await stripe.paymentIntents.create(params);
    // Send publishable key and PaymentIntent client_secret to client.
    res.send({
      clientSecret: paymentIntent.client_secret,
      status: paymentIntent.status
    });
  } catch (error) {
    res.send({
      error: error.raw.message
    });
  }
});

router.route("/create-payment-intent-with-payment-method").post(async (req, res) => {
  return; //Disabled
  const { items, currency, request_three_d_secure, email } = req.body;
  const { secret_key } = getKeys();

  const stripe = new Stripe(secret_key, {
    apiVersion: "2020-08-27",
    typescript: true
  });
  const customers = await stripe.customers.list({
    email
  });

  // The list all Customers endpoint can return multiple customers that share the same email address.
  // For this example we're taking the first returned customer but in a production integration
  // you should make sure that you have the right Customer.
  if (!customers.data[0]) {
    res.send({
      error: "There is no associated customer object to the provided e-mail"
    });
  }
  // List the customer's payment methods to find one to charge
  const paymentMethods = await stripe.paymentMethods.list({
    customer: customers.data[0].id,
    type: "card"
  });

  if (!paymentMethods.data[0]) {
    res.send({
      error: `There is no associated payment method to the provided customer's e-mail`
    });
  }

  const params = {
    amount: calculateOrderAmount(items),
    currency,
    payment_method_options: {
      card: {
        request_three_d_secure: request_three_d_secure || "automatic"
      }
    },
    payment_method: paymentMethods.data[0].id,
    customer: customers.data[0].id
  };

  const paymentIntent = await stripe.paymentIntents.create(params);

  // Send publishable key and PaymentIntent client_secret to client.
  res.send({
    clientSecret: paymentIntent.client_secret,
    paymentMethodId: paymentMethods.data[0].id
  });
});

router.route("/pay-without-webhooks").post(async (req, res) => {
  return; //Disabled
  const {
    paymentMethodId,
    paymentIntentId,
    items,
    currency,
    useStripeSdk,
    cvcToken,
    email
  } = req.body;

  const orderAmount = calculateOrderAmount(items);
  const { secret_key } = getKeys();

  const stripe = new Stripe(secret_key, {
    apiVersion: "2020-08-27",
    typescript: true
  });

  try {
    if (cvcToken && email) {
      const customers = await stripe.customers.list({
        email
      });

      // The list all Customers endpoint can return multiple customers that share the same email address.
      // For this example we're taking the first returned customer but in a production integration
      // you should make sure that you have the right Customer.
      if (!customers.data[0]) {
        res.send({
          error: "There is no associated customer object to the provided e-mail"
        });
      }

      const paymentMethods = await stripe.paymentMethods.list({
        customer: customers.data[0].id,
        type: "card"
      });

      if (!paymentMethods.data[0]) {
        res.send({
          error: `There is no associated payment method to the provided customer's e-mail`
        });
      }

      const params = {
        amount: orderAmount,
        confirm: true,
        confirmation_method: "manual",
        currency,
        payment_method: paymentMethods.data[0].id,
        payment_method_options: {
          card: {
            cvc_token: cvcToken
          }
        },
        use_stripe_sdk: useStripeSdk,
        customer: customers.data[0].id
      };
      const intent = await stripe.paymentIntents.create(params);
      res.send(generateResponse(intent));
    } else if (paymentMethodId) {
      // Create new PaymentIntent with a PaymentMethod ID from the client.
      const params = {
        amount: orderAmount,
        confirm: true,
        confirmation_method: "manual",
        currency,
        payment_method: paymentMethodId,
        // If a mobile client passes `useStripeSdk`, set `use_stripe_sdk=true`
        // to take advantage of new authentication features in mobile SDKs.
        use_stripe_sdk: useStripeSdk
      };
      const intent = await stripe.paymentIntents.create(params);
      // After create, if the PaymentIntent's status is succeeded, fulfill the order.
      res.send(generateResponse(intent));
    } else if (paymentIntentId) {
      // Confirm the PaymentIntent to finalize payment after handling a required action
      // on the client.
      const intent = await stripe.paymentIntents.confirm(paymentIntentId);
      // After confirm, if the PaymentIntent's status is succeeded, fulfill the order.
      res.send(generateResponse(intent));
    }
  } catch (e) {
    // Handle "hard declines" e.g. insufficient funds, expired card, etc
    // See https://stripe.com/docs/declines/codes for more.
    res.send({ error: e.message });
  }
});

router.route("/create-setup-intent").post(async (req, res) => {
  return; //Disabled
  const { email, payment_method_types = [] } = req.body;
  const { secret_key } = getKeys(payment_method_types[0]);

  const stripe = new Stripe(secret_key, {
    apiVersion: "2020-08-27",
    typescript: true
  });
  const customer = await stripe.customers.create({ email });
  const setupIntent = await stripe.setupIntents.create({
    customer: customer.id,
    payment_method_types
  });

  // Send publishable key and SetupIntent details to client
  res.send({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    clientSecret: setupIntent.client_secret
  });
});

// Expose a endpoint as a webhook handler for asynchronous events.
// Configure your webhook in the stripe developer dashboard:
// https://dashboard.stripe.com/test/webhooks
router.route("/webhook").post(
  // Use body-parser to retrieve the raw body as a buffer.
  bodyParser.raw({ type: "application/json" }),
  async (req, res) => {
    // Retrieve the event by verifying the signature using the raw body and secret.
    let event;
    const { secret_key } = getKeys();

    const stripe = new Stripe(secret_key, {
      apiVersion: "2020-08-27",
      typescript: true
    });
    // console.log('webhook!', req);
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        req.headers["stripe-signature"] || [],
        stripeWebhookSecret
      );
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed.`);
      res.sendStatus(400);
      return;
    }

    // Extract the data from the event.
    const data = event.data;
    const eventType = event.type;

    if (eventType === "payment_intent.succeeded") {
      // Cast the event into a PaymentIntent to make use of the types.
      const pi = data.object;

      // Funds have been captured
      // Fulfill any orders, e-mail receipts, etc
      // To cancel the payment after capture you will need to issue a Refund (https://stripe.com/docs/api/refunds).
      console.log(`🔔  Webhook received: ${pi.object} ${pi.status}!`);
      console.log("💰 Payment captured!");
    }
    if (eventType === "payment_intent.payment_failed") {
      // Cast the event into a PaymentIntent to make use of the types.
      const pi = data.object;
      console.log(`🔔  Webhook received: ${pi.object} ${pi.status}!`);
      console.log("❌ Payment failed.");
    }

    if (eventType === "setup_intent.setup_failed") {
      console.log(`🔔  A SetupIntent has failed the to setup a PaymentMethod.`);
    }

    if (eventType === "setup_intent.succeeded") {
      console.log(
        `🔔  A SetupIntent has successfully setup a PaymentMethod for future use.`
      );
    }

    if (eventType === "setup_intent.created") {
      const setupIntent = data.object;
      console.log(`🔔  A new SetupIntent is created. ${setupIntent.id}`);
    }

    res.sendStatus(200);
  }
);

// An endpoint to charge a saved card
// In your application you may want a cron job / other internal process
router.route("/charge-card-off-session").post(async (req, res) => {
  return; //Disabled
  let paymentIntent, customer;

  const { secret_key } = getKeys();

  const stripe = new Stripe(secret_key, {
    apiVersion: "2020-08-27",
    typescript: true
  });

  try {
    // You need to attach the PaymentMethod to a Customer in order to reuse
    // Since we are using test cards, create a new Customer here
    // You would do this in your payment flow that saves cards
    customer = await stripe.customers.list({
      email: req.body.email
    });

    // List the customer's payment methods to find one to charge
    const paymentMethods = await stripe.paymentMethods.list({
      customer: customer.data[0].id,
      type: "card"
    });

    // Create and confirm a PaymentIntent with the order amount, currency,
    // Customer and PaymentMethod ID
    paymentIntent = await stripe.paymentIntents.create({
      amount: calculateOrderAmount(),
      currency: "usd",
      payment_method: paymentMethods.data[0].id,
      customer: customer.data[0].id,
      off_session: true,
      confirm: true
    });

    res.send({
      succeeded: true,
      clientSecret: paymentIntent.client_secret,
      publicKey: stripePublishableKey
    });
  } catch (err) {
    if (err.code === "authentication_required") {
      // Bring the customer back on-session to authenticate the purchase
      // You can do this by sending an email or app notification to let them know
      // the off-session purchase failed
      // Use the PM ID and client_secret to authenticate the purchase
      // without asking your customers to re-enter their details
      res.send({
        error: "authentication_required",
        paymentMethod: err.raw.payment_method.id,
        clientSecret: err.raw.payment_intent.client_secret,
        publicKey: stripePublishableKey,
        amount: calculateOrderAmount(),
        card: {
          brand: err.raw.payment_method.card.brand,
          last4: err.raw.payment_method.card.last4
        }
      });
    } else if (err.code) {
      // The card was declined for other reasons (e.g. insufficient funds)
      // Bring the customer back on-session to ask them for a new payment method
      res.send({
        error: err.code,
        clientSecret: err.raw.payment_intent.client_secret,
        publicKey: stripePublishableKey
      });
    } else {
      console.log("Unknown error occurred", err);
    }
  }
});

// This example sets up an endpoint using the Express framework.
// Watch this video to get started: https://youtu.be/rPR2aJ6XnAc.

router.route("/payment-sheet").post(async (req, res) => {
  
  const secret_key  = stripeSecretKey;

  const stripe = new Stripe(secret_key, {
    apiVersion: "2020-08-27"
  });
  const {
    email,
    amount,
  } = req.body;
  const customersWithEmail = await stripe.customers.list({
    email
  });
  let customer = customersWithEmail.data[0]
  if (!customer) {
    customer = await stripe.customers.create({ email });
  }
  


  // Here, we're getting latest customer only for example purposes.
  // const customer = customers.data[0];

  if (!customer) {
    res.send({
      error: "Error creating customer"
    });
  }

  const ephemeralKey = await stripe.ephemeralKeys.create(
    { customer: customer.id },
    { apiVersion: "2020-08-27" }
  );
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount*100 | 0,
    currency: "ils",
    customer: customer.id
  });
  res.json({
    paymentIntent: paymentIntent.client_secret,
    ephemeralKey: ephemeralKey.secret,
    customer: customer.id
  });
});

module.exports = router;