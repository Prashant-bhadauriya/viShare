import { doc, updateDoc, arrayUnion, arrayRemove, getDoc } from "firebase/firestore";
import { db } from "../firebase";

export const toggleLike = async (videoId, userId) => {
  const videoRef = doc(db, "videos", videoId);
  const videoSnap = await getDoc(videoRef);
  const videoData = videoSnap.data();

  const hasLiked = videoData.likes?.includes(userId);
  const hasDisliked = videoData.dislikes?.includes(userId);

  const update = {};
  if (hasLiked) {
    update.likes = arrayRemove(userId);
  } else {
    update.likes = arrayUnion(userId);
    if (hasDisliked) update.dislikes = arrayRemove(userId);
  }

  await updateDoc(videoRef, update);
};

export const toggleDislike = async (videoId, userId) => {
  const videoRef = doc(db, "videos", videoId);
  const videoSnap = await getDoc(videoRef);
  const videoData = videoSnap.data();

  const hasDisliked = videoData.dislikes?.includes(userId);
  const hasLiked = videoData.likes?.includes(userId);

  const update = {};
  if (hasDisliked) {
    update.dislikes = arrayRemove(userId);
  } else {
    update.dislikes = arrayUnion(userId);
    if (hasLiked) update.likes = arrayRemove(userId);
  }

  await updateDoc(videoRef, update);
};
