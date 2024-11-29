import {auth, signOut} from "@/auth";
import SettingsForm from "@/components/SettingsForm";
import {prisma} from "@/db";
import {Button} from "@radix-ui/themes";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const session = await auth();
  if (!session) {
    return redirect('/login');
  }
  if (!session?.user?.email) {
    return 'not logged in';
  }
  const profile = await prisma.profile.findFirst({
    where: {email: session.user.email},
  });
  return (
    <div className="max-w-sm mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Profile settings
      </h1>
      <p className="text-gray-500 text-xs text-center -mt-4 mb-4">
        {session.user.email}
      </p>
      <SettingsForm
        profile={profile}
        role={profile?.role === undefined ? 'user' : profile?.role}
      />
      <div className="flex justify-center mt-4 pt-4 border-t border-gray-300">
        <form action={async () => {
          'use server';
          await signOut();
          redirect('/login');
        }}>
          <Button type="submit" variant="outline">
            Logout
          </Button>
        </form>
      </div>
    </div>
  );
}