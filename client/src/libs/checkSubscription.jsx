import axios from "axios";

export const checkSubscription = async (userId) => {
  if (!userId) {
    return false;
  }

  const { data } = await axios.post(
    `${process.env.REACT_APP_API_URL}/check-subscription`,
    {
      userId,
    }
  );

  console.log("data in checksubsciption", data);

  const userSubscription = data.userSubscription;

  if (!userSubscription) {
    return false;
  }
  const DAY_IN_MS = 86_400_000;
  const isValid =
    userSubscription.stripePriceId &&
    Date.parse(userSubscription.stripeCurrentPeriodEnd) + DAY_IN_MS >
      Date.now();
  console.log(
    Date.parse(userSubscription.stripeCurrentPeriodEnd) + DAY_IN_MS > Date.now()
  );

  return !!isValid;
};
