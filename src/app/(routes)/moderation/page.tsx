import PostsGrid from "@/components/ModFeed"
import {prisma} from "@/db";
import {auth} from "@/auth";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const session = await auth();
  if (!session) {
    return redirect('/login');
  }
    const posts = await prisma.post.findMany({
        orderBy: {createdAt: 'desc'},
        take: 100,
      });
      return (
        <div>
          <PostsGrid posts={posts}/>
        </div>
      );
}