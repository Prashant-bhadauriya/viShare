import React, { useEffect, useState } from "react";
import {
  FaUserCircle,
  FaThumbsUp,
  FaThumbsDown,
  FaCommentDots,
  FaEye,
} from "react-icons/fa";
import ShareButton from "./ShareButton";
import CommentSection from "./CommentSection";
import { trackWatchedVideo, auth } from "../firebase";
import {
  getLikesCount,
  hasUserLiked,
  hasUserDisliked,
  toggleLike,
  toggleDislike,
} from "../utilities/firebaseHelpers";

const VideoCard = ({ video }) => {
  const [likesCount, setLikesCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [viewCount, setViewCount] = useState(video?.views || 0);

  const userId = auth?.currentUser?.uid;
  const videoId = video?.id || video?.videoId || null;

  useEffect(() => {
    // console.log("videoId in VideoCard:", videoId);
    // console.log("video object:", video);

    if (!videoId || !userId) return;

    const fetchLikeStatus = async () => {
      try {
        const [likes, isLiked, isDisliked] = await Promise.all([
          getLikesCount(videoId),
          hasUserLiked(videoId, userId),
          hasUserDisliked(videoId, userId),
        ]);
        setLikesCount(likes);
        setLiked(isLiked);
        setDisliked(isDisliked);
      } catch (error) {
        console.error("Error fetching like status:", error);
      }
    };

    fetchLikeStatus();
  }, [videoId, userId]);

  const handleLike = async () => {
    if (!videoId || !userId) return;

    setLiked((prev) => !prev);
    setDisliked(false);

    try {
      await toggleLike(videoId, userId);
      const [likes, isLiked, isDisliked] = await Promise.all([
        getLikesCount(videoId),
        hasUserLiked(videoId, userId),
        hasUserDisliked(videoId, userId),
      ]);
      setLikesCount(likes);
      setLiked(isLiked);
      setDisliked(isDisliked);
    } catch (err) {
      console.error("Like toggle failed:", err);
    }
  };

  const handleDislike = async () => {
    if (!videoId || !userId) return;

    setDisliked((prev) => !prev);
    setLiked(false);

    try {
      await toggleDislike(videoId, userId);
      const [likes, isLiked, isDisliked] = await Promise.all([
        getLikesCount(videoId),
        hasUserLiked(videoId, userId),
        hasUserDisliked(videoId, userId),
      ]);
      setLikesCount(likes);
      setLiked(isLiked);
      setDisliked(isDisliked);
    } catch (err) {
      console.error("Dislike toggle failed:", err);
    }
  };

  const handlePlay = () => {
    if (videoId) {
      trackWatchedVideo(videoId);
      setViewCount((prev) => prev + 1);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-lg hover:shadow-xl transition-shadow space-y-4">
      {/* 🎥 Video */}
      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black">
        <video controls onPlay={handlePlay} className="w-full h-full object-cover">
          <source src={video?.video_files?.[0]?.link} type="video/mp4" />
        </video>
        <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
          <FaEye className="text-sm" /> {viewCount}
        </div>
      </div>

      {/* 👤 Uploader */}
      <div className="flex items-center gap-3">
        <FaUserCircle className="text-3xl text-gray-600 dark:text-gray-400" />
        <div>
          <h3 className="text-base font-medium text-gray-800 dark:text-white">
            {video?.user?.name || "Unknown User"}
          </h3>
          <span className="text-xs text-gray-500 dark:text-gray-400">Uploader</span>
        </div>
      </div>

      {/* 📝 Description */}
      <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
        {video?.description || "No description available."}
      </p>

      {/* 🏷️ Tags */}
      {Array.isArray(video?.tags) && video.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 text-xs text-blue-500 mt-1">
          {video.tags.map((tag, i) => (
            <span
              key={i}
              className="bg-blue-100 dark:bg-blue-800 px-2 py-1 rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* 🔘 Buttons */}
      <div className="grid grid-cols-4 gap-3 mt-2">
        <button
          onClick={handleLike}
          className={`flex items-center justify-center gap-1 px-3 py-2 rounded-lg font-medium text-sm transition-all transform hover:scale-105 ${
            liked
              ? "bg-blue-600 text-white"
              : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
          }`}
        >
          <FaThumbsUp /> {likesCount}
        </button>

        <button
          onClick={handleDislike}
          className={`flex items-center justify-center gap-1 px-3 py-2 rounded-lg font-medium text-sm transition-all transform hover:scale-105 ${
            disliked
              ? "bg-red-600 text-white"
              : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
          }`}
        >
          <FaThumbsDown />
        </button>

        <div className="col-span-2 flex justify-end items-center">
          <FaCommentDots className="text-green-500 text-lg" />
        </div>
      </div>

      {/* 🔗 Share */}
      <ShareButton url={video?.video_files?.[0]?.link || "#"} />

      {/* 💬 Comments */}
      <div className="mt-4">
        <CommentSection videoId={videoId} onError={(err) => console.error("CommentSection error:", err)} />
      </div>
    </div>
  );
};

export default VideoCard;
