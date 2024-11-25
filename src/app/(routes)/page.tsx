import {auth} from "@/auth";
import Preloader from "@/components/Preloader";
import UserHome from "@/components/UserHome";
import { redirect } from "next/navigation";
import {Suspense} from "react";

export default async function Home() {
  const session = await auth();
  if (!session) {
    return redirect('/login');
  }
  return (
    <div className="">
        <Suspense fallback={<Preloader />}>
          <UserHome session={session} />
        </Suspense>
    </div>
  );
}
