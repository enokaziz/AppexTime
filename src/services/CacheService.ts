import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState, AppStateStatus } from 'react-native';

const CACHE_KEY = '@image_cache';
const LAST_CLEANUP_KEY = '@last_cache_cleanup';
const CLEANUP_INTERVAL = 24 * 60 * 60 * 1000; // 24 heures

interface CachedImage {
  url: string;
  timestamp: number;
  data: string;
}

/**
 * Service pour gérer le cache des images
 */
class CacheService {
  private static instance: CacheService;
  private cleanupTimeout: NodeJS.Timeout | null = null;
  private appStateSubscription: { remove: () => void } | null = null;

  private constructor() {
    this.setupAppStateListener();
    this.scheduleCleanup();
  }

  /**
   * Obtient l'instance unique du service
   */
  public static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
    }
    return CacheService.instance;
  }

  /**
   * Configure l'écouteur d'état de l'application
   */
  private setupAppStateListener() {
    this.appStateSubscription = AppState.addEventListener(
      'change',
      this.handleAppStateChange,
    );
  }

  /**
   * Gère les changements d'état de l'application
   */
  private handleAppStateChange = async (nextAppState: AppStateStatus) => {
    if (nextAppState === 'active') {
      await this.checkAndCleanup();
    }
  };

  /**
   * Planifie le nettoyage automatique du cache
   */
  private scheduleCleanup() {
    if (this.cleanupTimeout) {
      clearTimeout(this.cleanupTimeout);
    }

    this.cleanupTimeout = setTimeout(async () => {
      await this.checkAndCleanup();
      this.scheduleCleanup();
    }, CLEANUP_INTERVAL);
  }

  /**
   * Vérifie et nettoie le cache si nécessaire
   */
  private async checkAndCleanup() {
    try {
      const lastCleanup = await AsyncStorage.getItem(LAST_CLEANUP_KEY);
      const now = Date.now();

      if (!lastCleanup || now - parseInt(lastCleanup) > CLEANUP_INTERVAL) {
        await this.cleanupCache();
        await AsyncStorage.setItem(LAST_CLEANUP_KEY, now.toString());
      }
    } catch (error) {
      console.error('Erreur lors de la vérification du cache:', error);
    }
  }

  /**
   * Nettoie le cache des images expirées
   */
  private async cleanupCache() {
    try {
      const cachedData = await AsyncStorage.getItem(CACHE_KEY);
      if (!cachedData) return;

      const cache: Record<string, CachedImage> = JSON.parse(cachedData);
      const now = Date.now();
      const validCache: Record<string, CachedImage> = {};

      Object.entries(cache).forEach(([url, data]) => {
        if (now - data.timestamp < CLEANUP_INTERVAL) {
          validCache[url] = data;
        }
      });

      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(validCache));
    } catch (error) {
      console.error('Erreur lors du nettoyage du cache:', error);
    }
  }

  /**
   * Vide complètement le cache
   */
  public async clearCache() {
    try {
      await AsyncStorage.removeItem(CACHE_KEY);
      await AsyncStorage.removeItem(LAST_CLEANUP_KEY);
    } catch (error) {
      console.error('Erreur lors de la suppression du cache:', error);
    }
  }

  /**
   * Nettoie le service
   */
  public cleanup() {
    if (this.cleanupTimeout) {
      clearTimeout(this.cleanupTimeout);
    }
    if (this.appStateSubscription) {
      this.appStateSubscription.remove();
    }
  }
}

export default CacheService;
