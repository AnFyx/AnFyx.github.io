import SettingsForm from "@/components/SettingsForm";
import {prisma} from "@/db";
import {Button} from "@radix-ui/themes";
import { createClient } from "../../../../utils/supabase/server";
import { logout } from "./../../(routes)/logout/actions";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getSession();
  const session = data?.session;
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
      />
      <div className="flex justify-center mt-4 pt-4 border-t border-gray-300">
        <form action={async () => {
          'use server';
          await logout();
        }}>
          <Button type="submit" variant="outline">
            Logout
          </Button>
        </form>
      </div>
    </div>
  );
}