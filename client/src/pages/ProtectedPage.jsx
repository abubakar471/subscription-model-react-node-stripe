import { UserButton, useAuth, useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { checkSubscription } from "../libs/checkSubscription";
import { Link } from "react-router-dom";
import axios from "axios";

const ProtectedPage = () => {
  const [isPro, setIsPro] = useState(false);
  const { userId } = useAuth();
  const { user } = useUser();

  const checkingSubscription = async () => {
    console.log("checking in protected page");
    const subscriptionStatus = await checkSubscription(userId);
    console.log(subscriptionStatus);
    setIsPro(subscriptionStatus);

    if (!subscriptionStatus) {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/create-checkout-session`,
        {
          userId: userId,
          email: user.emailAddresses[0].emailAddress,
        }
      );

      if (data.url) {
        window.location.href = data.url;
      }
    }
  };

  const handleBillings = async () => {
    const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/manage-billings`, {
      userId: userId,
    });

    window.location.href = data.url;
  };

  useEffect(() => {
    // if (user) {
    //   setEmail(user.emailAddresses[0].emailAddress);
    // }
    if (user) {
      checkingSubscription();
    }
  }, [user]);

  return (
    <div>
      <nav className="navbar">
        <Link href="/">
          <h2>Stripe React Crash Project</h2>
        </Link>
        <div className="navbar-btn-group">
          {isPro && (
            <button className="billing-button" onClick={handleBillings}>
              Manage Billings
            </button>
          )}
          <UserButton />
        </div>
      </nav>

      {isPro && (
        <div className="container">
          <h1>Dashboard Contents</h1>
          <h4 style={{ color: "green" }}>
            You are currently subscribed to our plan
          </h4>
          <h3>You are now authorized to view dashboard contents</h3>
        </div>
      )}

      {/* <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        ,<button type="submit">Subscribe</button>
      </form> */}
    </div>
  );
};

export default ProtectedPage;
