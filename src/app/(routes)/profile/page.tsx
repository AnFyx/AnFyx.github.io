import ProfilePageContent from "@/components/ProfilePageContent";
import {prisma} from "@/db";
import {redirect} from "next/navigation";
import { createClient } from './../../../../utils/supabase/server'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()
  const profile = await prisma.profile
    .findFirst({where:{email:data?.user?.email as string}});
  if (!profile) {
    return redirect('/settings');
  }
  return (
    <ProfilePageContent
      ourFollow={null}
      profile={profile}
      isOurProfile={true} />
  );
}