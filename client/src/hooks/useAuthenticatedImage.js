import { useState, useEffect } from 'react';
import api from '../services/api';

/**
 * Custom hook to fetch authenticated images and convert them to blob URLs
 * @param {string} imageUrl - The URL of the image to fetch
 * @returns {string|null} - The blob URL or null if loading/error
 */
export const useAuthenticatedImage = (imageUrl) => {
  const [blobUrl, setBlobUrl] = useState(null);

  useEffect(() => {
    if (!imageUrl) {
      setTimeout(() => setBlobUrl(null), 0);
      return;
    }

    let objectUrl = null;

    const fetchImage = async () => {
      try {
        const response = await api.get(imageUrl, {
          responseType: 'blob',
        });
        
        objectUrl = URL.createObjectURL(response.data);
        setBlobUrl(objectUrl);
      } catch (error) {
        console.error('Error fetching authenticated image:', error);
        setBlobUrl(null);
      }
    };

    fetchImage();

    // Cleanup: revoke the blob URL when component unmounts or URL changes
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [imageUrl]);

  return blobUrl;
};
