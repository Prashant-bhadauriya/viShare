// Import Firebase SDKs
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, getDoc, doc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Firebase Config (Using Environment Variables)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// 🔥 Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // ✅ Full Firestore, not 'lite'
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const storage = getStorage(app);

// 📌 Function to Add a Comment
const addComment = async (videoId, comment) => {
  try {
    await addDoc(collection(db, "comments"), {
      videoId,
      comment,
      timestamp: new Date()
    });
  } catch (error) {
    console.error("🔥 Error adding comment:", error);
  }
};

// 📌 Track Watched Videos
const trackWatchedVideo = async (videoId) => {
  if (!auth.currentUser) return;

  try {
    const userRef = doc(db, "users", auth.currentUser.uid);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      await updateDoc(userRef, { watchedVideos: arrayUnion(videoId) });
    } else {
      await setDoc(userRef, { watchedVideos: [videoId] });
    }
  } catch (error) {
    console.error("🔥 Error tracking watched video:", error);
  }
};

// 📌 Fetch User Data
const getUserData = async () => {
  if (!auth.currentUser) return null;

  try {
    const userRef = doc(db, "users", auth.currentUser.uid);
    const userDoc = await getDoc(userRef);

    return userDoc.exists() ? userDoc.data() : null;
  } catch (error) {
    console.error("🔥 Error fetching user data:", error);
    return null;
  }
};

// 📌 Fetch All Videos from Firestore
const fetchVideos = async () => {
  try {
    if (!auth.currentUser) {
      console.error("User is not authenticated");
      alert("Please log in to access videos.");
      return [];
    }

    const videosRef = collection(db, "videos");
    const snapshot = await getDocs(videosRef);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("🔥 Error fetching videos:", error.message);
    if (error.code === "permission-denied") {
      alert("You do not have permission to access videos. Please log in.");
    }
    return [];
  }
};


// ✅ Export Functions & Firebase Instances
export { db, auth, provider, storage, addComment, trackWatchedVideo, getUserData, fetchVideos };
