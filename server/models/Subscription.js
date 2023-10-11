const mongoose = require("mongoose");
const subscriptionSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true,
  },
  stripeCustomerId: {
    type: String,
    required: true,
  },
  stripeCurrentPeriodEnd: {
    type: Date,
    required: true,
  },
  stripePriceId: {
    type: String,
    required: true,
  },
  stripeSubscriptionId: {
    type: String,
    required: true,
  },
});

const Subscription = mongoose.model("Subscription", subscriptionSchema);

module.exports = Subscription;
