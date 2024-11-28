import PostsGrid from "@/components/PostsGrid";
import {prisma} from "@/db";
import {auth} from "@/auth";
import { redirect } from "next/navigation";
import { getSessionRole } from "@/actions";

export default async function BrowsePage() {
  const session = await auth();
  if (!session) {
    return redirect('/login');
  }
  if (await getSessionRole() !== 'user') {
    return redirect('/');
  }
  const posts = await prisma.post.findMany({
    where: {approved: true},
    orderBy: {createdAt: 'desc'},
    take: 100,
  });
  return (
    <div>
      <PostsGrid posts={posts}/>
    </div>
  );
}