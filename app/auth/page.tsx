"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { navigate } from "@/utils/actions";
import useAuth from "@/hooks/useAuth";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import { ImSpinner2 } from "react-icons/im";

interface Inputs {
  email: string;
  uname: string;
  password: string;
  confirmPassword: string;
}

const Auth = () => {
  const { user, signIn, signUp } = useAuth();

  const [login, setLogin] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    unregister,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async ({
    email,
    uname,
    password,
    confirmPassword,
  }) => {
    setLoading(true);
    if (login) {
      await signIn(email, password)
        .then(() => {
          navigate("/dashboard");
        })
        .catch((error: any) => {
          setError(error.message.replace("Firebase: ", ""));
          setLoading(false);
        });
    } else {
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        setLoading(false);
        return;
      }

      await signUp(email, password, uname).catch((error: any) => {
        setError(error.message.replace("Firebase: ", ""));
        setLoading(false);
      });
    }
  };

  const searchParams = useSearchParams();
  useEffect(() => {
    const type = searchParams.get("type");
    if (type === "signup") setLogin(false);
    else setLogin(true);
  }, [searchParams]);

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

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="relative mt-24 space-y-7 rounded bg-black/75 py-10 px-6 md:mt-0 md:max-w-md md:px-14"
      >
        <h1 className="text-4xl font-semibold">
          {login ? "Sign In" : "Sign Up"}
        </h1>
        <div className="space-y-4">
          <label className="inline-block w-full">
            <input
              type="email"
              placeholder="Email"
              className="input-field"
              id="email_input"
              {...register("email", { required: true })}
            />
            {errors.email && (
              <p className="p-1 text-red-500 font-light text-[13px]">
                {errors.email.message || "Please enter a valid email."}
              </p>
            )}
          </label>

          {!login && (
            <label className="inline-block w-full">
              <input
                type="text"
                placeholder="Username"
                className="input-field"
                id="uname_input"
                {...register("uname", { required: true })}
              />
              {errors.uname && (
                <p className="p-1 text-red-500 font-light text-[13px]">
                  {errors.uname.message || "Please enter a valid username."}
                </p>
              )}
            </label>
          )}

          <label className="inline-block w-full">
            <div className="flex flex-row items-center w-full rounded outline-none">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="input-field"
                {...register("password", { required: true })}
              />
              <p
                className="absolute right-16 text-right text-[13px] text-[gray] font-light cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "HIDE" : "SHOW"}
              </p>
            </div>
            {errors.password && (
              <p className="p-1 text-red-500 font-light text-[13px]">
                {errors.password.message ||
                  "Your password must be between 4 and 60 characters."}
              </p>
            )}
          </label>

          {!login && (
            <label className="inline-block w-full">
              <div className="flex flex-row items-center w-full rounded outline-none">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  className="input-field"
                  {...register("confirmPassword", { required: true })}
                />
                <p
                  className="absolute right-16 text-right text-[13px] text-[gray] font-light cursor-pointer"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? "HIDE" : "SHOW"}
                </p>
              </div>
              {errors.confirmPassword && (
                <p className="p-1 text-red-500 font-light text-[13px]">
                  {errors.confirmPassword.message ||
                    "Your password must be between 4 and 60 characters."}
                </p>
              )}
            </label>
          )}
        </div>

        <div className="flex flex-col space-y-4">
          <button
            className="w-full rounded bg-blue-500 py-3 font-semibold"
            type="submit"
          >
            {loading ? (
              <div className="flex justify-center items-center">
                <ImSpinner2 className="dark:fill-gray-300 animate-spin h-5 w-5 text-white" />
                <span className="ml-2">Loading...</span>
              </div>
            ) : login ? (
              "Sign In"
            ) : (
              "Sign Up"
            )}
          </button>
          <p
            className="text-red-500 font-light text-[13px] mt-[-5px]"
            id="error"
          >
            {error}
          </p>
        </div>

        <div className="flex flex-col space-y-2">
          <div className="text-[gray] flex">
            {login ? "Don't have an account?" : "Already have an account?"}
            <div
              className="text-white hover:underline ml-1 cursor-pointer"
              onClick={() => {
                setLogin(!login);
                setError("");
              }}
            >
              {login ? "Sign up now" : "Sign in"}
            </div>
            .
          </div>
        </div>
      </form>
    </div>
  );
};

export default Auth;
