import React, { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  addDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import { motion, AnimatePresence } from "framer-motion";

const CommentSection = ({ videoId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComments = async () => {
      if (!videoId) {
        console.warn("videoId is missing — skipping comment fetch");
        return;
      }

      setLoading(true);
      try {
        const commentsRef = collection(db, "videos", String(videoId), "comments");
        const q = query(commentsRef, orderBy("timestamp", "desc"));
        const snapshot = await getDocs(q);

        const fetched = await Promise.all(
          snapshot.docs.map(async (doc) => {
            const data = doc.data();
            let userInfo = {};

            try {
              const userSnap = await getDocs(
                query(collection(db, "users"), where("uid", "==", data.userId))
              );
              userInfo = userSnap.docs[0]?.data() || {};
            } catch (err) {
              console.warn("User info fetch failed:", err.message);
            }

            return {
              id: doc.id,
              ...data,
              displayName: userInfo.displayName || "Anonymous",
              photoURL: userInfo.photoURL || null,
            };
          })
        );

        setComments(fetched);
      } catch (err) {
        console.error("Error fetching comments:", err.message);
        setError("Failed to load comments.");
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [videoId]);

  const handleAddComment = async () => {
    if (!auth.currentUser) {
      setError("You must be logged in to comment.");
      return;
    }

    if (!videoId) {
      console.error("Invalid videoId: null or undefined");
      setError("Invalid video reference.");
      return;
    }

    if (newComment.trim() === "") return;

    try {
      const newCommentData = {
        comment: newComment,
        timestamp: serverTimestamp(),
        userId: auth.currentUser.uid,
      };

      const commentsRef = collection(db, "videos", String(videoId), "comments");
      const docRef = await addDoc(commentsRef, newCommentData);

      setComments([
        {
          id: docRef.id,
          ...newCommentData,
          displayName: auth.currentUser.displayName || "You",
          photoURL: auth.currentUser.photoURL || null,
        },
        ...comments,
      ]);
      setNewComment("");
    } catch (err) {
      console.error("Error adding comment:", err.message);
      setError("Failed to add comment.");
    }
  };

  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-xl shadow space-y-4">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
        Comments
      </h3>

      {error && <p className="text-red-500">{error}</p>}
      {loading && (
        <div className="space-y-2">
          <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-1/2 animate-pulse" />
          <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-3/4 animate-pulse" />
        </div>
      )}

      <ul className="space-y-3">
        <AnimatePresence>
          {comments.map((comment) => (
            <motion.li
              key={comment.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white dark:bg-gray-700 p-3 rounded-lg shadow-sm flex gap-3"
            >
              {comment.photoURL ? (
                <img
                  src={comment.photoURL}
                  alt="avatar"
                  className="w-9 h-9 rounded-full"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-gray-400" />
              )}
              <div>
                <p className="font-medium text-sm text-gray-800 dark:text-white">
                  {comment.displayName}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {comment.comment}
                </p>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      <div className="flex flex-col gap-2">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
        <button
          onClick={handleAddComment}
          className="self-end px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition font-medium text-sm"
        >
          Add Comment
        </button>
      </div>
    </div>
  );
};

export default CommentSection;
