import React, { useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';
import { UploadCloud, File } from 'lucide-react';
import { auth } from '../firebase'; 

const Upload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [fileURL, setFileURL] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileURL(URL.createObjectURL(selectedFile)); 
    }
  };

  const handleUpload = async () => {
    if (!file) return;
  
    const user = auth.currentUser;
    if (!user) {
      alert("You must be logged in to upload.");
      return;
    }
  
    setUploading(true);
    try {
      const storageRef = ref(storage, `videos/${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setFileURL(url);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed. Check Firebase Storage rules and your login status.");
    } finally {
      setUploading(false);
      setFile(null);
    }
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-6 shadow-md flex flex-col items-center justify-center gap-4">
      <label className="cursor-pointer flex flex-col items-center gap-2 p-4 border border-dashed border-gray-400 dark:border-gray-600 rounded-lg w-full text-center hover:bg-gray-200 dark:hover:bg-gray-700 transition">
        <UploadCloud size={32} className="text-gray-600 dark:text-gray-300" />
        <span className="text-gray-600 dark:text-gray-300">Drag & Drop or Click to Upload</span>
        <input type="file" accept="video/*" onChange={handleFileChange} className="hidden" />
      </label>

      {file && (
        <div className="w-full flex items-center justify-between bg-white dark:bg-gray-700 p-3 rounded-lg shadow">
          <div className="flex items-center gap-2">
            <File size={20} className="text-gray-600 dark:text-gray-300" />
            <span className="text-gray-700 dark:text-gray-300">{file.name}</span>
          </div>
          <button
            onClick={handleUpload}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition"
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      )}

      {fileURL && (
        <video src={fileURL} controls className="w-full rounded-lg shadow-md" />
      )}
    </div>
  );
};

export default Upload;
