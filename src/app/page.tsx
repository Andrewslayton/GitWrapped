import SigninButton from "@/components/SigningInButton";
import Image from "next/image";
import { redirect } from "next/navigation";

export default function Home() {
  return (
    <main>
      <h1>Home</h1>
      <SigninButton />
      {/* if (session && session.user && session.user.access_token){ 
        redirect("/wrapped")
      } */}
    </main>
  );
}
