import {getSessionEmailOrThrow} from "@/actions";
import HomePosts from "@/components/HomePosts";
import {prisma} from "@/db";
import {Session} from "next-auth";

export default async function UserHome({session}:{session:Session}) {
  const follows = await prisma.follower.findMany({
    where: {
      followingProfileEmail: session?.user?.email || '',
    },
  });
  const profiles = await prisma.profile.findMany({
    where: {
      id: {in: follows.map(f => f.followedProfileId)},
    },
  });
  return (
    <div className="flex flex-col gap-8">
      <HomePosts follows={follows} profiles={profiles} />
    </div>
  );
}