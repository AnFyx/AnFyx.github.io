import {auth} from "./../actions";
import CommentForm from "@/components/CommentForm";
import {prisma} from "@/db";

export default async function SessionCommentForm({postId}:{postId:string}) {
  const session = await auth();
  const profile = await prisma.profile.findFirstOrThrow({
    where: {email: session?.email as string},
  });
  return (
    <CommentForm postId={postId} avatar={profile.avatar || ''} />
  );
}