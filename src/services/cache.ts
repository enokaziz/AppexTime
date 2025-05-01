/**
 * Service de gestion du cache pour l'application
 * Permet de stocker temporairement des données pour améliorer les performances
 * et réduire les appels réseau
 */

// Types pour la gestion du cache
type CacheItem = {
  data: any;
  timestamp: number;
  expiresAt: number | null;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
};

type CacheOptions = {
  ttl?: number; // Time-to-live en millisecondes
  priority?: 'HIGH' | 'MEDIUM' | 'LOW';
};

// Configuration par défaut
const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes
const MAX_CACHE_SIZE = 100; // Nombre maximum d'éléments dans le cache
const CACHE_CLEANUP_INTERVAL = 60 * 1000; // Intervalle de nettoyage (1 minute)

// Cache en mémoire
const memoryCache: Map<string, CacheItem> = new Map();

// Initialisation du nettoyage périodique du cache
let cleanupInterval: NodeJS.Timeout | null = null;

/**
 * Initialise le service de cache
 */
export const initCache = () => {
  if (cleanupInterval === null) {
    cleanupInterval = setInterval(cleanupCache, CACHE_CLEANUP_INTERVAL);
  }
};

/**
 * Arrête le service de cache
 */
export const stopCache = () => {
  if (cleanupInterval !== null) {
    clearInterval(cleanupInterval);
    cleanupInterval = null;
  }
};

/**
 * Nettoie le cache en supprimant les éléments expirés
 * et en réduisant la taille du cache si nécessaire
 */
export const cleanupCache = () => {
  const now = Date.now();
  
  // Suppression des éléments expirés
  for (const [key, item] of memoryCache.entries()) {
    if (item.expiresAt !== null && item.expiresAt < now) {
      memoryCache.delete(key);
    }
  }
  
  // Réduction de la taille du cache si nécessaire
  if (memoryCache.size > MAX_CACHE_SIZE) {
    // Trie les éléments par priorité (LOW en premier) puis par ancienneté
    const sortedItems = Array.from(memoryCache.entries())
      .sort((a, b) => {
        // D'abord par priorité
        const priorityOrder = { HIGH: 3, MEDIUM: 2, LOW: 1 };
        const priorityDiff = priorityOrder[a[1].priority] - priorityOrder[b[1].priority];
        
        if (priorityDiff !== 0) return priorityDiff;
        
        // Ensuite par ancienneté
        return a[1].timestamp - b[1].timestamp;
      });
    
    // Supprime les éléments les moins prioritaires jusqu'à atteindre la taille maximale
    const itemsToRemove = sortedItems.slice(0, memoryCache.size - MAX_CACHE_SIZE);
    for (const [key] of itemsToRemove) {
      memoryCache.delete(key);
    }
  }
};

/**
 * Ajoute ou met à jour un élément dans le cache
 * @param key Clé de l'élément
 * @param data Données à stocker
 * @param options Options de mise en cache
 */
export const setItem = async (key: string, data: any, options: CacheOptions = {}) => {
  const now = Date.now();
  const ttl = options.ttl || DEFAULT_TTL;
  const priority = options.priority || 'MEDIUM';
  
  const cacheItem: CacheItem = {
    data,
    timestamp: now,
    expiresAt: ttl > 0 ? now + ttl : null,
    priority
  };
  
  memoryCache.set(key, cacheItem);
  
  // Nettoyage si le cache dépasse la taille maximale
  if (memoryCache.size > MAX_CACHE_SIZE) {
    cleanupCache();
  }
  
  return true;
};

/**
 * Récupère un élément du cache
 * @param key Clé de l'élément
 * @returns Données stockées ou null si non trouvé ou expiré
 */
export const getItem = async (key: string): Promise<any | null> => {
  const now = Date.now();
  const item = memoryCache.get(key);
  
  // Vérifie si l'élément existe et n'est pas expiré
  if (item && (item.expiresAt === null || item.expiresAt > now)) {
    return item.data;
  }
  
  // Supprime l'élément s'il est expiré
  if (item && item.expiresAt !== null && item.expiresAt <= now) {
    memoryCache.delete(key);
  }
  
  return null;
};

/**
 * Supprime un élément du cache
 * @param key Clé de l'élément
 */
export const removeItem = async (key: string): Promise<boolean> => {
  return memoryCache.delete(key);
};

/**
 * Vide entièrement le cache
 */
export const clearCache = async (): Promise<boolean> => {
  memoryCache.clear();
  return true;
};

/**
 * Précharge un ensemble de données dans le cache
 * @param items Objets à mettre en cache {key, data, options}
 */
export const preloadCache = async (items: Array<{key: string, data: any, options?: CacheOptions}>) => {
  const promises = items.map(item => setItem(item.key, item.data, item.options));
  return Promise.all(promises);
};

/**
 * Invalide un groupe d'éléments du cache en fonction d'un préfixe
 * @param prefix Préfixe des clés à invalider
 */
export const invalidateByPrefix = async (prefix: string): Promise<number> => {
  let count = 0;
  
  for (const key of memoryCache.keys()) {
    if (key.startsWith(prefix)) {
      memoryCache.delete(key);
      count++;
    }
  }
  
  return count;
};

// Initialise le cache au démarrage
initCache();
