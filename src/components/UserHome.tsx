import HomePosts from "@/components/HomePosts";
import HomeTopRow from "@/components/HomeTopRow";
import {prisma} from "@/db";
import {auth} from "./../actions";

export default async function UserHome() {
  const session = await auth();
  const follows = await prisma.follower.findMany({
    where: {
      followingProfileEmail: session?.email || '',
    },
  });
  const profiles = await prisma.profile.findMany({
    where: {
      id: {in: follows.map(f => f.followedProfileId)},
    },
  });
  return (
    <div className="flex flex-col gap-8">
      <HomeTopRow follows={follows} profiles={profiles}/>
      <HomePosts follows={follows} profiles={profiles} />
    </div>
  );
}