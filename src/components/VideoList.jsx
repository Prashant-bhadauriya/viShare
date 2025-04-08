import React from "react";
import VideoCard from "./VideoCard";
import SkeletonCard from "../utilities/SkeletonCard";
import { v4 as uuidv4 } from "uuid";

const VideoList = ({ videos, loading }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {loading
        ? Array.from({ length: 6 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))
        : videos.map((video) => <VideoCard key={video.id || uuidv4()} video={video} />)}
    </div>
  );
};

export default VideoList;
