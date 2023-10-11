const express = require("express");
const User = require("./models/User");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const stripe = require("stripe")(
  "sk_test_51NyAkCHYbdQN8eXLcPj5eiRhIYcRwjKYfyd1IpKeJcGfxlfiDWQ35vV1fKpWDLyMcLtfx9WZOaZj5HrtXHxFGJVi00ltQnzdCl"
);

require("dotenv").config();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("mogno connected successfully");
  })
  .catch((err) => {
    console.log("mongo conenction error => ", err);
  });

// initiate a new payment
app.post("/create-checkout-session", async (req, res) => {
  const { userId, email } = req.body;
  console.log(req.body);

  // first time checking out in our app
  const stripeSession = await stripe.checkout.sessions.create({
    success_url: process.env.CLIENT_URL + "/protected",
    cancel_url: process.env.CLIENT_URL + "/checkout-failed",
    payment_method_types: ["card"],
    billing_address_collection: "auto",
    customer_email: email,
    line_items: [
      {
        price: "price_1NyIMjHYbdQN8eXLWT22OjRi",
        quantity: 1,
      },
    ],
    mode: "subscription",
    // the metadata is gonna be used to identify which user of ours purchased pro plan
    metadata: {
      userId,
      email,
    },
  });

  res.json({
    url: stripeSession.url,
  });
});

// check whether client is subscribed or not
app.post("/check-subscription", async (req, res) => {
  console.log("checking subscription.....");
  const { userId } = req.body;

  const user = await User.findOne({
    userId: userId,
  });

  if (!user) {
    return res.json({ userSubscription: null });
  }

  console.log("user found => ", user);
  return res.status(200).json({
    userSubscription: user,
  });
});

// manage billings for existed customer
app.post("/manage-billings", async (req, res) => {
  console.log("managing billings....");
  const { userId } = req.body;

  const userSubscription = await User.findOne({
    userId: userId
  });

  if (userSubscription && userSubscription.stripeCustomerId) {
    const stripeSession = await stripe.billingPortal.sessions.create({
      customer: userSubscription.stripeCustomerId,
      return_url: process.env.CLIENT_URL + "/protected",
    });

    return res.json({ url: stripeSession.url });
  }
});

// This is your Stripe CLI webhook secret for testing your endpoint locally.
let endpointSecret;

app.post("/webhook", express.raw({ type: "application/json" }), (req, res) => {
  let data;
  // console.log(req.body);
  // console.log("headers => ", req.headers);
  let eventType;
  const sig = req.headers["stripe-signature"];

  if (endpointSecret) {
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        JSON.stringify(req.body),
        sig,
        endpointSecret
      );
      console.log("webhook verified");
    } catch (err) {
      console.log(`Webhook Error: ${err.message}`);
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    data = event.data.object;
    eventType = event.type;
  } else {
    data = req.body.data.object;
    eventType = req.body.type;
  }
  // Handle the event
  if (eventType === "checkout.session.completed") {
    console.log("checkout session completed data => ", data);
    console.log("data.subsciption => ", data.subscription);
    stripe.subscriptions
      .retrieve(data.subscription)
      .then((subscription) => {
        // createOrder(customer, data);
        console.log("subscription created => ", subscription);
        const newUser = new User({
          email: data?.metadata?.email,
          userId: data?.metadata?.userId,
          stripeSubscriptionId: subscription.id,
          stripeCustomerId: subscription.customer,
          stripePriceId: subscription.items.data[0].price.id,
          stripeCurrentPeriodEnd: new Date(
            subscription.current_period_end * 1000
          ),
        });

        newUser.save();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  // Return a 200 response to acknowledge receipt of the event
  res.send();
});

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log("server is running on port 8000.....");
});
