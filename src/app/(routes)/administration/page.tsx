import ProfilePages from "@/components/AdminFeed"
import {auth} from "@/auth";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const session = await auth();
  if (!session) {
    return redirect('/login');
  }
  return (
    <div>
      <ProfilePages />
    </div>
  );
}