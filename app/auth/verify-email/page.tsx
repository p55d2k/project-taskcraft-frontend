"use client";

import { navigate } from "@/actions/navigate";

import useAuth from "@/hooks/useAuth";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const VerifyEmail = () => {
  const [emailVerified, setEmailVerified] = useState<boolean | undefined>(
    false
  );
  const [resendCountdown, setResendCountdown] = useState<number>(-1);

  const { verifyEmail, user } = useAuth();

  const sendAndCheckEmail = () => {
    if (emailVerified) return;

    if (resendCountdown > 0) return;
    setResendCountdown(60);

    if (!user) {
      navigate("/auth");
      return;
    }

    verifyEmail();

    const interval = setInterval(() => {
      setResendCountdown((prev) => prev - 1);
      resendCountdown === 0 && clearInterval(interval);

      user.reload();
      setEmailVerified(user.emailVerified);
      if (user.emailVerified) {
        clearInterval(interval);
      }
    }, 1000);
  };

  useEffect(() => {
    if (user?.emailVerified) {
      navigate("/projects");
      return;
    }

    sendAndCheckEmail();
  }, []);

  return (
    <div className="relative flex h-screen w-screen flex-col bg-black md:items-center md:justify-center md:bg-transparent">
      <div className="absolute left-0 right-0 bottom-0 top-0 w-screen h-screen">
        <video
          src="/hero.mp4"
          autoPlay
          loop
          muted
          className="object-cover w-screen h-full pointer-events-none opacity-40 hidden md:flex"
        />
      </div>

      <Link href="/" className="absolute hidden sm:flex left-6 top-6">
        <Image
          unoptimized
          src={"/logo-nobg.png"}
          width={100}
          height={100}
          alt=""
        />
      </Link>

      <div className="flex flex-col relative mt-24 space-y-8 rounded bg-black/75 py-10 px-6 md:mt-0 md:max-w-md md:px-12">
        <h1 className="text-4xl font-semibold">
          {emailVerified ? "Email Verified!" : "Verify Your Email"}
        </h1>

        {emailVerified ? (
          <p className="text-blue-500 text-lg font-semibold">
            Thanks for verifying your email! Click the button below to continue.
          </p>
        ) : (
          <p className="text-blue-500 text-lg font-semibold">
            We have sent you an email to verify your email address. <br />
            Please check your inbox and click the link to verify your email.
            <br />
            If you did not receive the email, please check your spam folder.
            <br />
            You can click the button below to resend the email.
          </p>
        )}

        {emailVerified ? (
          <Link
            href="/projects"
            className="text-lg font-semibold text-white hover:underline"
          >
            Continue
          </Link>
        ) : (
          <p
            className={`text-lg font-semibold ${
              resendCountdown > 1
                ? "text-gray-600"
                : "text-white hover:underline cursor-pointer"
            }`}
            onClick={sendAndCheckEmail}
          >
            Resend Verification Email{" "}
            {resendCountdown > 0 && `(${resendCountdown})`}
          </p>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
