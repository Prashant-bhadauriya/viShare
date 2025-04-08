import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { fetchVideos } from "./utilities/api";
import { db } from "./firebase"; 
import VideoList from "./components/VideoList";
import Upload from "./components/Upload";
import { auth, provider } from "./firebase";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { Moon, Sun } from "lucide-react";
import logo from "./assets/viShare_logo.png";
import { Toaster } from "react-hot-toast";

const App = () => {
  const [user, setUser] = useState(null);
  const [videos, setVideos] = useState([]);
  const [query, setQuery] = useState("nature");
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const fetchFirestoreVideos = async () => {
      setLoading(true);
      try {
        const videosRef = collection(db, "videos"); 
        const snapshot = await getDocs(videosRef);
        const videoList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setVideos(videoList);
      } catch (error) {
        console.error("Error fetching videos from Firestore:", error);
      }
      setLoading(false);
    };

    fetchFirestoreVideos();
  }, []);

  useEffect(() => {
    const loadVideos = async () => {
      setLoading(true);
      try {
        if (!query.match(/^[a-zA-Z0-9 ]*$/)) return;
        const fetchedVideos = await fetchVideos(query);
        setVideos(fetchedVideos);
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
      setLoading(false);
    };
    loadVideos();
  }, [query]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login Error:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  return (
    <>
    <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"} min-h-screen transition-colors duration-300`}>
      <div className="container mx-auto p-6 max-w-6xl">
        <div className="flex justify-between items-center mb-6">
          <img src={logo} alt="viShare Logo" className="h-12 w-auto" />
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <span className="font-semibold">{user.displayName}</span>
                <button onClick={handleLogout} className="p-2 bg-red-500 text-white rounded-md shadow-md hover:bg-red-600 transition">
                  Logout
                </button>
              </>
            ) : (
              <button onClick={handleLogin} className="p-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 transition">
                Login
              </button>
            )}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full shadow-md bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 transition"
            >
              {darkMode ? <Sun size={24} /> : <Moon size={24} />}
            </button>
          </div>
        </div>
        <div className="flex items-center gap-3 mb-4">
          <input
            type="text"
            placeholder="Search for videos..."
            value={query}
            onChange={(e) => setQuery(e.target.value.replace(/[^a-zA-Z0-9 ]/g, ""))}
            className="border p-3 rounded-lg w-full bg-white dark:bg-gray-800 dark:text-white shadow-md"
          />
          <button className="p-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition">Search</button>
        </div>
        {user ? <Upload /> : <div className="text-center mb-4 text-red-500 font-bold">Please log in to upload videos</div>}
        <VideoList videos={videos} loading={loading} />
      </div>
    </div>
    <footer className="bg-gray-800 text-white py-4 text-center">
      <p>&copy; 2025 viShare. All rights reserved.</p>
    </footer>
    <div className="fixed bottom-4 right-4  ">
      <a href="#top" className="p-2 bg-blue-500 text-white rounded-full shadow-md hover:bg-blue-600 transition">
        ↑ 
      </a>
    </div>
    <div id="top" className="absolute top-0"></div>
    <Toaster position="top-right" />
    </>
  );
};

export default App;
