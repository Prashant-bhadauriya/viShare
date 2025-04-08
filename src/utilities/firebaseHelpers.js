import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "../firebase";

// Helper to safely get video data
const getVideoData = async (videoId) => {
  if (!videoId || typeof videoId !== "string") return null;
  const videoRef = doc(db, "videos", videoId);
  const videoSnap = await getDoc(videoRef);
  return videoSnap.exists() ? { ref: videoRef, data: videoSnap.data() } : null;
};

// Toggle Like
export const toggleLike = async (videoId, userId) => {
  if (!videoId || !userId) return;

  const video = await getVideoData(videoId);
  if (!video) return;

  const { data, ref } = video;
  const likes = data.likes || [];
  const dislikes = data.dislikes || [];
  const hasLiked = likes.includes(userId);
  const hasDisliked = dislikes.includes(userId);

  try {
    console.log("Toggle Like Triggered", { videoId, userId });
    console.log("Video Data Before:", data);

    if (hasLiked) {
      await updateDoc(ref, {
        likes: arrayRemove(userId),
      });
    } else {
      await updateDoc(ref, {
        likes: arrayUnion(userId),
        dislikes: arrayRemove(userId),
      });
    }

    console.log("Like Updated Successfully");
  } catch (err) {
    console.error("Error toggling like:", err);
  }
};

// Toggle Dislike
export const toggleDislike = async (videoId, userId) => {
  if (!videoId || !userId) return;

  const video = await getVideoData(videoId);
  if (!video) return;

  const { data, ref } = video;
  const likes = data.likes || [];
  const dislikes = data.dislikes || [];
  const hasDisliked = dislikes.includes(userId);
  const hasLiked = likes.includes(userId);

  try {
    console.log("Toggle Dislike Triggered", { videoId, userId });
    console.log("Video Data Before:", data);

    if (hasDisliked) {
      await updateDoc(ref, {
        dislikes: arrayRemove(userId),
      });
    } else {
      await updateDoc(ref, {
        dislikes: arrayUnion(userId),
        likes: arrayRemove(userId),
      });
    }

    console.log("Dislike Updated Successfully");
  } catch (err) {
    console.error("Error toggling dislike:", err);
  }
};

// Get like count
export const getLikesCount = async (videoId) => {
  const video = await getVideoData(videoId);
  return video ? video.data.likes?.length || 0 : 0;
};

// Get dislike count
export const getDislikesCount = async (videoId) => {
  const video = await getVideoData(videoId);
  return video ? video.data.dislikes?.length || 0 : 0;
};

// Check if user liked the video
export const hasUserLiked = async (videoId, userId) => {
  const video = await getVideoData(videoId);
  return video ? video.data.likes?.includes(userId) : false;
};

// Check if user disliked the video
export const hasUserDisliked = async (videoId, userId) => {
  const video = await getVideoData(videoId);
  return video ? video.data.dislikes?.includes(userId) : false;
};
