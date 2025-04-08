
import axios from 'axios';

const API_KEY = import.meta.env.VITE_PEXELS_API_KEY;



export const fetchVideos = async (query) => {
  try {
    const response = await axios.get(`https://api.pexels.com/videos/search?query=${query}`, {
      headers: {
        Authorization: API_KEY,
      },
    });
    return response.data.videos;
  } catch (error) {
    console.error('Error fetching videos:', error);
    return [];
  }
};
