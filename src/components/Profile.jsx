import React, { useEffect, useState } from "react";
import { auth } from "../firebase";
import { getUserData } from "../firebase";
import VideoList from "./VideoList";

const Profile = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const data = await getUserData();
      setUserData(data);
    };
    fetchUserData();
  }, []);

  if (!auth.currentUser) {
    return <p className="text-center text-red-500">Please log in to view your profile.</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Profile</h1>
      <p className="text-center text-lg font-semibold">Welcome, {auth.currentUser.displayName || "User"}!</p>

      <div className="mt-6">
        <h2 className="text-2xl font-semibold mb-3">Watched Videos</h2>
        {userData?.watchedVideos?.length ? (
          <VideoList videos={userData.watchedVideos} />
        ) : (
          <p className="text-gray-500">No watched videos yet.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
