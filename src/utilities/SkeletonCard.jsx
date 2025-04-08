import React from "react";

const SkeletonCard = () => {
  return (
    <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-lg hover:shadow-xl transition-shadow space-y-4 animate-pulse">
      {/* 🎥 Video Placeholder */}
      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-gray-300 dark:bg-gray-700" />

      {/* 👤 Uploader Info */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-400 dark:bg-gray-600" />
        <div className="space-y-1">
          <div className="w-24 h-3 bg-gray-400 dark:bg-gray-600 rounded" />
          <div className="w-16 h-2 bg-gray-300 dark:bg-gray-500 rounded" />
        </div>
      </div>

      {/* 📝 Description */}
      <div className="space-y-2">
        <div className="w-full h-3 bg-gray-300 dark:bg-gray-500 rounded" />
        <div className="w-5/6 h-3 bg-gray-300 dark:bg-gray-500 rounded" />
        <div className="w-4/6 h-3 bg-gray-300 dark:bg-gray-500 rounded" />
      </div>

      {/* 🏷️ Tags */}
      <div className="flex flex-wrap gap-2">
        <div className="w-12 h-4 bg-blue-200 dark:bg-blue-700 rounded-full" />
        <div className="w-14 h-4 bg-blue-200 dark:bg-blue-700 rounded-full" />
        <div className="w-10 h-4 bg-blue-200 dark:bg-blue-700 rounded-full" />
      </div>

      {/* 🔘 Actions */}
      <div className="grid grid-cols-4 gap-3 mt-2">
        <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded-lg" />
        <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded-lg" />
        <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded-lg" />
        <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded-lg" />
      </div>

      {/* 🔗 Share Placeholder */}
      <div className="w-full h-8 bg-gray-300 dark:bg-gray-600 rounded-lg" />
    </div>
  );
};

export default SkeletonCard;
