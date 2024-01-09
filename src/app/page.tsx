import SigninButton from "@/components/SigningInButton";
import Image from "next/image";
import { redirect } from "next/navigation";

export default function Home() {
  return (
    <main>
      <SigninButton />
      {/* if (session && session.user && session.user.access_token){ 
        redirect("/wrapped")
      } */}
    </main>
  );
}
