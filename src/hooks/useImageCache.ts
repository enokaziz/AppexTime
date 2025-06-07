import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'react-native';

interface CachedImage {
  url: string;
  timestamp: number;
  data: string;
}

const CACHE_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 jours en millisecondes
const CACHE_KEY = '@image_cache';

/**
 * Hook personnalisé pour gérer le cache des images
 * @param imageUrl - URL de l'image à mettre en cache
 * @returns {Object} État du cache et fonctions de gestion
 */
export const useImageCache = (imageUrl: string) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cachedImage, setCachedImage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadImage = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Vérifier le cache
        const cachedData = await AsyncStorage.getItem(CACHE_KEY);
        const cache: Record<string, CachedImage> = cachedData
          ? JSON.parse(cachedData)
          : {};

        const now = Date.now();
        const cachedImage = cache[imageUrl];

        // Vérifier si l'image est en cache et valide
        if (cachedImage && now - cachedImage.timestamp < CACHE_EXPIRY) {
          if (isMounted) {
            setCachedImage(cachedImage.data);
            setIsLoading(false);
          }
          return;
        }

        // Si pas en cache ou expiré, télécharger l'image
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const reader = new FileReader();

        reader.onload = async () => {
          const base64data = reader.result as string;

          // Mettre à jour le cache
          cache[imageUrl] = {
            url: imageUrl,
            timestamp: now,
            data: base64data,
          };

          await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(cache));

          if (isMounted) {
            setCachedImage(base64data);
            setIsLoading(false);
          }
        };

        reader.readAsDataURL(blob);
      } catch (err) {
        if (isMounted) {
          setError("Erreur lors du chargement de l'image");
          setIsLoading(false);
        }
      }
    };

    loadImage();

    return () => {
      isMounted = false;
    };
  }, [imageUrl]);

  /**
   * Nettoie le cache des images expirées
   */
  const clearExpiredCache = async () => {
    try {
      const cachedData = await AsyncStorage.getItem(CACHE_KEY);
      if (!cachedData) return;

      const cache: Record<string, CachedImage> = JSON.parse(cachedData);
      const now = Date.now();
      const validCache: Record<string, CachedImage> = {};

      Object.entries(cache).forEach(([url, data]) => {
        if (now - data.timestamp < CACHE_EXPIRY) {
          validCache[url] = data;
        }
      });

      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(validCache));
    } catch (error) {
      console.error('Erreur lors du nettoyage du cache:', error);
    }
  };

  /**
   * Vide complètement le cache
   */
  const clearCache = async () => {
    try {
      await AsyncStorage.removeItem(CACHE_KEY);
    } catch (error) {
      console.error('Erreur lors de la suppression du cache:', error);
    }
  };

  return {
    isLoading,
    error,
    cachedImage,
    clearExpiredCache,
    clearCache,
  };
};
