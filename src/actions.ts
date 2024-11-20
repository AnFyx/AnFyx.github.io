'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { prisma } from '@/db';
import { uniq } from 'lodash';

export async function auth() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  );
  const { data } = await supabase.auth.getUser();
  return data?.user;
}

export async function getSessionEmail(): Promise<string | null> {
  const session = await auth();
  return session?.id || null;
}

export async function getSessionEmailOrThrow(): Promise<string> {
  const userEmail = await getSessionEmail();
  if (!userEmail) {
    throw new Error('User not logged in');
  }
  return userEmail;
}

export async function updateProfile(data: FormData) {
  const userEmail = await getSessionEmailOrThrow();
  const newUserInfo = {
    username: data.get('username') as string | null,
    name: data.get('name') as string | null,
    subtitle: data.get('subtitle') as string | null,
    bio: data.get('bio') as string | null,
    avatar: data.get('avatar') as string | null,
  };
  await prisma.profile.upsert({
    where: { email: userEmail },
    update: newUserInfo,
    create: { email: userEmail, ...newUserInfo },
  });
}

export async function postEntry(data: FormData) {
  const sessionEmail = await getSessionEmailOrThrow();
  const postDoc = await prisma.post.create({
    data: {
      author: parseInt(sessionEmail, 10),
      image: data.get('image') as string,
      description: (data.get('description') as string) || '',
    },
  });
  return postDoc.id;
}

export async function postComment(data: FormData) {
  const authorEmail = await getSessionEmailOrThrow();
  return prisma.comment.create({
    data: {
      author: authorEmail,
      postId: parseInt(data.get('postId') as string, 10),
      text: data.get('text') as string,
    },
  });
}

async function updatePostLikesCount(postId: number) {
  await prisma.post.update({
    where: { id: postId },
    data: {
      likesCount: await prisma.like.count({ where: { postId } }),
    },
  });
}

export async function likePost(data: FormData) {
  const postId = parseInt(data.get('postId') as string, 10);
  await prisma.like.create({
    data: {
      author: parseInt(await getSessionEmailOrThrow(), 10),
      postId,
    },
  });
  await updatePostLikesCount(postId);
}

export async function removeLikeFromPost(data: FormData) {
  const postId = parseInt(data.get('postId') as string, 10);
  await prisma.like.deleteMany({
    where: {
      postId,
      author: parseInt(await getSessionEmailOrThrow(), 10),
    },
  });
  await updatePostLikesCount(postId);
}

export async function getSinglePostData(postId: number) {
  const post = await prisma.post.findFirstOrThrow({ where: { id: postId } });
  const authorProfile = await prisma.profile.findFirstOrThrow({
    where: { id: post.author },
  });
  const comments = await prisma.comment.findMany({ where: { postId } });
  const commentsAuthors = await prisma.profile.findMany({
    where: {
      id: { in: uniq(comments.map((c) => parseInt(c.author, 10))) },
    },
  });
  const sessionEmail = await getSessionEmailOrThrow();
  const myLike = await prisma.like.findFirst({
    where: {
      author: parseInt(sessionEmail, 10),
      postId,
    },
  });
  const myBookmark = await prisma.bookmark.findFirst({
    where: {
      author: parseInt(sessionEmail, 10),
      postId,
    },
  });
  return { post, authorProfile, comments, commentsAuthors, myLike, myBookmark };
}

export async function followProfile(profileIdToFollow: number) {
  const sessionProfile = await prisma.profile.findFirstOrThrow({
    where: { email: await getSessionEmailOrThrow() },
  });
  await prisma.follower.create({
    data: {
      followingProfileEmail: sessionProfile.email,
      followingProfileId: sessionProfile.id,
      followedProfileId: profileIdToFollow,
    },
  });
}

export async function unfollowProfile(profileIdToFollow: number) {
  const sessionProfile = await prisma.profile.findFirstOrThrow({
    where: { email: await getSessionEmailOrThrow() },
  });
  await prisma.follower.deleteMany({
    where: {
      followingProfileEmail: sessionProfile.email,
      followingProfileId: sessionProfile.id,
      followedProfileId: profileIdToFollow,
    },
  });
}

export async function bookmarkPost(postId: number) {
  const sessionEmail = await getSessionEmailOrThrow();
  await prisma.bookmark.create({
    data: {
      author: parseInt(sessionEmail, 10),
      postId,
    },
  });
}

export async function unbookmarkPost(postId: number) {
  const sessionEmail = await getSessionEmailOrThrow();
  await prisma.bookmark.deleteMany({
    where: {
      author: parseInt(sessionEmail, 10),
      postId,
    },
  });
}
