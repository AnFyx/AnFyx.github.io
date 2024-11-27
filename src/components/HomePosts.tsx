import {getSessionEmailOrThrow, getSessionRole} from "@/actions";
import BookmarkButton from "@/components/BookmarkButton";
import LikesInfo from "@/components/LikesInfo";
import DislikesInfo from "@/components/DislikesInfo";
import VtffInfo from "@/components/VtffInfo";
import {prisma} from "@/db";
import {Bookmark, Dislike, Like, Profile, Vtff} from "@prisma/client";
import {Avatar} from "@radix-ui/themes";
import Link from "next/link";

export default async function HomePosts({
  profiles,
}:{
  profiles: Profile[],
}) {
  if (await getSessionRole() === 'admin') {

    return (
      <div>
        {profiles?.length > 0 && (
          <div className="grid mt-4 sm:grid-cols-1 gap-2">
            {profiles.map(profile => (
              <Link
                key={profile.id}
                href={`/users/${profile.username}`}
                className="flex gap-2 bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 p-2 rounded-full">
                <div className="">
                  <Avatar
                    size="4"
                    radius="full"
                    fallback="user avatar"
                    src={profile.avatar || ''}/>
                </div>
                <div>
                  <h3>{profile.name}</h3>
                  <h4 className="text-gray-500 dark:text-gray-300 text-sm">
                    @{profile.username}
                  </h4>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    )
  }
  const mod = await getSessionRole() === 'mod';
  const posts = await prisma.post.findMany({
    where: {
      author: {in: profiles.map(p => p.email)},
      approved: mod ? false : true,
    },
    orderBy: {
      createdAt: mod ? 'asc' : 'desc',
    },
    take: 100,
  });
  let likes: Like[] = [];
  let dislikes: Dislike[] = [];
  let vtffs: Vtff[] = [];
  let bookmarks: Bookmark[] = [];
  if (!mod) {
    likes = await prisma.like.findMany({
      where: {
        author: await getSessionEmailOrThrow(),
        postId: {in: posts.map(p => p.id)},
      },
    });
    dislikes = await prisma.dislike.findMany({
      where: {
        author: await getSessionEmailOrThrow(),
        postId: {in: posts.map(p => p.id)},
      },
    });
    vtffs = await prisma.vtff.findMany({
      where: {
        author: await getSessionEmailOrThrow(),
        postId: {in: posts.map(p => p.id)},
      },
    });
    bookmarks = await prisma.bookmark.findMany({
      where: {
        author: await getSessionEmailOrThrow(),
        postId: {in: posts.map(p => p.id)},
      },
    });
  }
  return (
    <div
      className="max-w-md mx-auto flex flex-col gap-12">
      {posts.map(post => {
        const profile = profiles.find(p => p.email === post.author);
        return (
          <div
            key={post.id}
            className=""
          >
            <Link href={`/posts/${post.id}`}>
              <img
                className="block rounded-lg shadow-md shadow-black/50"
                src={post.image} alt=""/>
            </Link>
            <div className="flex items-center gap-2 mt-4 justify-between">
              <div className="flex gap-2 items-center">
                <Avatar
                  radius="full"
                  src={profile?.avatar || ''}
                  size="2"
                  fallback="avatar" />
                <Link
                  className="font-bold text-gray-700 dark:text-gray-300"
                  href={`/users/${profile?.username}`}>
                  {profile?.name}
                </Link>
              </div>
              {!mod && (
                <div className="flex gap-2 items-center">
                <LikesInfo
                  post={post}
                  showText={false}
                  sessionLike={likes.find(like => like.postId === post.id) || null}
                />
                <DislikesInfo
                  post={post}
                  showText={false}
                  sessionDislike={dislikes.find(dislike => dislike.postId === post.id) || null}
                />
                <VtffInfo
                  post={post}
                  showText={false}
                  sessionVtff={vtffs.find(vtff => vtff.postId === post.id) || null}
                />
                <BookmarkButton
                  post={post}
                  sessionBookmark={bookmarks.find(b => b.postId === post.id) || null} />
              </div>)}
            </div>
            <p className="mt-2 text-slate-600 dark:text-gray-400">
              {post.description}
            </p>
          </div>
        );
      })}
    </div>
  );
}