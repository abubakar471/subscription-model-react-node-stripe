import { ClerkProvider, RedirectToSignIn, SignedIn, SignedOut } from "@clerk/clerk-react";
import { Route, Routes, useNavigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Home from "./pages/Home";
import RegisterPage from "./pages/RegisterPage";
import ProtectedPage from "./pages/ProtectedPage";
import CheckoutSuccess from "./pages/CheckoutSuccess";
import CheckoutFailed from "./pages/CheckoutFailed";

const ClerkProviderWithRoutes = () => {
  const navigate = useNavigate();
  return (
    <ClerkProvider
      navigate={(to) => navigate(to)}
      publishableKey={process.env.REACT_APP_CLERK_PUBLISHABLE_KEY}
    >
      <Routes>
        <Route path="/login/*" name="Login" element={<LoginPage />} />
        <Route path="/register/*" name="Register" element={<RegisterPage />} />
        <Route path="/" name="Home" element={<Home />} />
        <Route path="/checkout-failed" name="Failed" element={<CheckoutFailed />} />
        <Route
          path="/protected"
          element={
            <>
              <SignedIn>
                <ProtectedPage />
              </SignedIn>
              <SignedOut>
                <RedirectToSignIn afterSignInUrl="/protected" />
              </SignedOut>
            </>
          }
        />
      </Routes>
    </ClerkProvider>
  );
};

export default ClerkProviderWithRoutes;
