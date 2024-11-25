import {getSessionEmail} from "@/actions";
import ProfilePageContent from "@/components/ProfilePageContent";
import {prisma} from "@/db";
import {auth} from "@/auth";
import { redirect } from "next/navigation";

type Props = {
  params: {
    username: string
  }
}

export default async function UserProfilePage(props: Props) {
  const session = await auth();
  if (!session) {
    return redirect('/login');
  }
  const { username } = await props.params;
  const sessionEmail = await getSessionEmail() || '';
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