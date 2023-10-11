import { SignIn } from "@clerk/clerk-react";

const LoginPage = () => {
  return (
    <div className="h-screen flex items-center justify-center">
      <SignIn afterSignInUrl="/protected" />
    </div>
  );
};

export default LoginPage;
