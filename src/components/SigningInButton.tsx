"use client";
import React from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

const SignInButton = () => {
  const { data: session } = useSession();

  if (session && session.user) {
    return (
      <header className="flex gap-4 p-4 bg-black">
        <Link href="/">
          <h1 className="text-blue-300">Find a Partner!</h1>
        </Link>
        <div className="flex gap-4 ml-auto">
          <p className="text-blue-300">{session.user.name}</p>
          <button onClick={() => signOut()} className="text-red-600">
            Sign out
          </button>
        </div>
      </header>
    );
  }
  return (
  <div className="flex justify-center items-center h-screen">
    <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
      <div className="border-4 border-blue-300 rounded-full w-3/4 h-3/4 absolute"></div>
      <div className="border-4 border-green-300 rounded-full w-2/3 h-2/3 absolute"></div>
      <div className="border-4 border-red-300 rounded-full w-1/2 h-1/2 absolute"></div>
      <div className="border-4 border-yellow-300 rounded-full w-1/3 h-1/3 absolute"></div>
    </div>
    <button onClick={() => signIn()} className="text-blue-300 z-10">
      Sign in
    </button>
  </div>
);


};
export default SignInButton;
