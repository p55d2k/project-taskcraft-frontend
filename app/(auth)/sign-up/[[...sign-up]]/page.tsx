import { SignUp } from "@clerk/nextjs";

const SignUpPage = () => {
  return (
    <main className="flex h-screen w-full flex-col items-center justify-center gap-10">
      <SignUp forceRedirectUrl={"/new-account"} />
    </main>
  );
};

export default SignUpPage;
