import PostsGrid from "@/components/PostsGrid";
import ProfileNav from "@/components/ProfileNav";
import ProfilePageInfo from "@/components/ProfilePageInfo";
import {prisma} from "@/db";
import {redirect} from "next/navigation";
import { createClient } from "../../../../../utils/supabase/server";

export default async function BookmarkedPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getSession();
  const profile = await prisma.profile
  .findFirst({where:{email:data?.session?.user?.email as string}});
  if (!profile) {
    return redirect('/settings');
  }
  const bookmarks = await prisma.bookmark.findMany({
    where: {author:Number(data?.session?.user?.id)},
  });
  const posts = await prisma.post.findMany({
    where: {id: {in: bookmarks.map(b => b.postId)}},
  })
  return (
    <div>
      <ProfilePageInfo
        profile={profile}
        isOurProfile={true}
        ourFollow={null} />
      <ProfileNav
        username={profile.username || ''}
        isOurProfile={true} />
      <div className="mt-4">
        <PostsGrid posts={posts} />
      </div>
    </div>
  );
}