"use client";

import styles from "@/styles/Home.module.css";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";


const SignInButton = () => {
  const { data: session } = useSession();

  if (session && session.user) {
    redirect("/wrapped");
    return <p>Redirecting...</p>;
  }
  return (
  <div className="flex justify-center items-center h-screen ">
    <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
      <div className="border-8 border-blue-300 rounded-full w-3/4 h-3/4 absolute bounce-on-hover"></div>
      {/* <div className="border-4 border-green-300 rounded-full w-2/3 h-2/3 absolute"></div> */}
      <div className="border-8 border-red-300 rounded-full w-1/2 h-1/2 absolute bounce-on-hover"></div>
      <div className="border-8 border-yellow-300 rounded-full w-1/3 h-1/3 absolute bounce-on-hover"></div>
      <div className="border-8 border-purple-300 rounded-full w-1/5 h-1/4 absolute bounce-on-hover"></div>
    </div>
    <button onClick={() => signIn()} className=" bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded z-10 ">
      Sign in with GitHub
    </button>
  </div>
);
};
export default SignInButton;