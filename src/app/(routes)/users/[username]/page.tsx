import ProfilePageContent from "@/components/ProfilePageContent";
import {prisma} from "@/db";
import { createClient } from "../../../../../utils/supabase/server";

export default async function UserProfilePage({
  params:{username},
}:{
  params:{username:string};
}) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getSession();
  const sessionEmail = data?.session?.user?.email;
  const profile = await prisma.profile.findFirstOrThrow({
    where:{username:username}
  });
  const ourFollow = await prisma.follower.findFirst({
    where: {
      followingProfileEmail: sessionEmail,
      followedProfileId: profile.id,
    },
  });
  return (
    <ProfilePageContent
      isOurProfile={profile.email === sessionEmail}
      ourFollow={ourFollow}
      profile={profile} />
  );
}