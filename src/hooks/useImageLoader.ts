import { useState, useEffect } from 'react';
import { Image } from 'react-native';

/**
 * Hook personnalisé pour gérer le chargement des images avec lazy loading
 * @param imageUrl - URL de l'image à charger
 * @param placeholderUrl - URL de l'image de placeholder (optionnel)
 * @returns {Object} État du chargement et l'URL de l'image
 */
export const useImageLoader = (imageUrl: string, placeholderUrl?: string) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState(placeholderUrl || '');

  useEffect(() => {
    let isMounted = true;

    const loadImage = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Précharger l'image
        await Image.prefetch(imageUrl);

        if (isMounted) {
          setCurrentImageUrl(imageUrl);
          setIsLoading(false);
        }
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

  return {
    isLoading,
    error,
    imageUrl: currentImageUrl,
  };
};

/**
 * Hook pour gérer le chargement progressif des images
 * @param imageUrl - URL de l'image à charger
 * @returns {Object} État du chargement et l'URL de l'image
 */
export const useProgressiveImage = (imageUrl: string) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setIsError(true);
  };

  return {
    isLoaded,
    isError,
    handleLoad,
    handleError,
  };
};
