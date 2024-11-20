import PostsGrid from "@/components/PostsGrid";
import {prisma} from "@/db";

export default async function ProfilePosts({id}:{id:number}) {
  const posts = await prisma.post.findMany({where:{author:id}});
  return (
    <PostsGrid posts={posts} />
  );
}