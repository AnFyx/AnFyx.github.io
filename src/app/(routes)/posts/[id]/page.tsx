import {getSinglePostData} from "@/actions";
import SinglePostContent from "@/components/SinglePostContent";

type Props = {
  params: {
    id: string
  }
}

export default async function SinglePostPage(props: Props) {
  const { id } = await props.params;
  const {
    post, authorProfile, comments,
    commentsAuthors, myLike, myBookmark,
  } = await getSinglePostData(id);
  return (
    <SinglePostContent
      post={post}
      authorProfile={authorProfile}
      comments={comments}
      commentsAuthors={commentsAuthors}
      myLike={myLike}
      myBookmark={myBookmark}
    />
  );
}