import { SignUp } from "@clerk/clerk-react";

const RegisterPage = () => {
  return (
    <div className="h-screen flex items-center justify-center">
      <SignUp afterSignUpUrl="/protected" />
    </div>
  );
};

export default RegisterPage;
