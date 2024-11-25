'use server';

import {auth} from "@/auth";
import {prisma} from "@/db";
import {uniq} from "lodash";

export async function getSessionEmail(): Promise<string|null|undefined> {
  const session = await auth();
  return session?.user?.email;
}

export async function getSessionEmailOrThrow(): Promise<string> {
  const userEmail = await getSessionEmail();
  if (!userEmail) {
    throw 'not logged in';
  }
  return userEmail;
}

export async function updateProfile(data: FormData) {
  const userEmail = await getSessionEmailOrThrow();
  const newUserInfo = {
    username: data.get('username') as string,
    name: data.get('name') as string,
    subtitle: data.get('subtitle') as string,
    bio: data.get('bio') as string,
    avatar: data.get('avatar') as string,
  };
  await prisma.profile.upsert({
    where: {
      email: userEmail,
    },
    update: newUserInfo,
    create: {
      email: userEmail,
      ...newUserInfo,
    },
  });
}

export async function postEntry(data: FormData) {
  const sessionEmail = await getSessionEmailOrThrow();
  const postDoc = await prisma.post.create({
    data: {
      author: sessionEmail,
      image: data.get('image') as string,
      description: data.get('description') as string || '',
    },
  });
  return postDoc.id;
}

export async function postComment(data: FormData) {
  const authorEmail = await getSessionEmailOrThrow();
  return prisma.comment.create({
    data: {
      author: authorEmail,
      postId: data.get('postId') as string,
      text: data.get('text') as string,
    },
  })
}

async function updatePostLikesCount(postId: string) {
  await prisma.post.update({
    where:{id:postId},
    data:{
      likesCount: await prisma.like.count({where:{postId}}),
    },
  });
}

export async function likePost(data: FormData) {
  const postId = data.get('postId') as string;
  await prisma.like.create({
    data: {
      author: await getSessionEmailOrThrow(),
      postId,
    },
  });
  await updatePostLikesCount(postId);
}

export async function removeLikeFromPost(data: FormData) {
  const postId = data.get('postId') as string;
  await prisma.like.deleteMany({
    where: {
      postId,
      author: await getSessionEmailOrThrow(),
    },
  });
  await updatePostLikesCount(postId);
}

async function updatePostDislikesCount(postId: string) {
  await prisma.post.update({
    where: { id: postId },
    data: {
      dislikesCount: await prisma.dislike.count({ where: { postId } }),
    },
  });
}

export async function dislikePost(data: FormData) {
  const postId = data.get('postId') as string;
  await prisma.dislike.create({
    data: {
      author: await getSessionEmailOrThrow(),
      postId,
    },
  });
  await updatePostDislikesCount(postId);
}

export async function removeDislikeFromPost(data: FormData) {
  const postId = data.get('postId') as string;
  await prisma.dislike.deleteMany({
    where: {
      postId,
      author: await getSessionEmailOrThrow(),
    },
  });
  await updatePostDislikesCount(postId);
}

async function updatePostVtffsCount(postId: string) {
  await prisma.post.update({
    where: { id: postId },
    data: {
      vtffsCount: await prisma.vtff.count({ where: { postId } }),
    },
  });
}

export async function vtffPost(data: FormData) {
  const postId = data.get('postId') as string;
  await prisma.vtff.create({
    data: {
      author: await getSessionEmailOrThrow(),
      postId,
    },
  });
  await updatePostVtffsCount(postId);
}

export async function removeVtffFromPost(data: FormData) {
  const postId = data.get('postId') as string;
  await prisma.vtff.deleteMany({
    where: {
      postId,
      author: await getSessionEmailOrThrow(),
    },
  });
  await updatePostVtffsCount(postId);
}

export async function getSinglePostData(postId:string) {
  const post = await prisma.post.findFirstOrThrow({where:{id:postId}});
  const authorProfile = await prisma.profile.findFirstOrThrow({where:{email:post.author}});
  const comments = await prisma.comment.findMany({where:{postId:post.id}});
  const commentsAuthors = await prisma.profile.findMany({
    where: {
      email: {in: uniq(comments.map(c => c.author))},
    },
  });
  const sessionEmail = await getSessionEmailOrThrow();
  const myLike = await prisma.like.findFirst({
    where: {
      author: sessionEmail,
      postId: post.id,
    }
  });
  const myBookmark = await prisma.bookmark.findFirst({
    where: {
      author: sessionEmail,
      postId: post.id,
    }
  });
  return {
    post, authorProfile, comments,
    commentsAuthors, myLike, myBookmark,
  };
}

export async function followProfile(profileIdToFollow:string) {
  const sessionProfile = await prisma.profile.findFirstOrThrow({
    where:{email: await getSessionEmailOrThrow()},
  });
  await prisma.follower.create({
    data: {
      followingProfileEmail: sessionProfile.email,
      followingProfileId: sessionProfile.id,
      followedProfileId: profileIdToFollow,
    },
  });
}

export async function unfollowProfile(profileIdToFollow:string) {
  const sessionProfile = await prisma.profile.findFirstOrThrow({
    where:{email: await getSessionEmailOrThrow()},
  });
  await prisma.follower.deleteMany({
    where: {
      followingProfileEmail: sessionProfile.email,
      followingProfileId: sessionProfile.id,
    },
  });
}

export async function bookmarkPost(postId:string) {
  const sessionEmail = await getSessionEmailOrThrow();
  await prisma.bookmark.create({
    data:{
      author: sessionEmail,
      postId,
    },
  });
}

export async function unbookmarkPost(postId:string) {
  const sessionEmail = await getSessionEmailOrThrow();
  await prisma.bookmark.deleteMany({
    where:{
      author: sessionEmail,
      postId,
    },
  });
}