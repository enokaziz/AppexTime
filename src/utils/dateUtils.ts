/**
 * Utilitaires pour la gestion des dates Firebase
 */

/**
 * Formate une date Firebase (timestamp) en string lisible
 * @param dateValue - La valeur de date (peut être un timestamp Firebase, string, ou Date)
 * @param locale - La locale pour le formatage (défaut: 'fr-FR')
 * @returns String formatée de la date
 */
export const formatFirebaseDate = (
  dateValue: any,
  locale: string = 'fr-FR',
): string => {
  if (!dateValue) return 'Date inconnue';

  // Si c'est un timestamp Firebase (objet avec seconds et nanoseconds)
  if (dateValue && typeof dateValue === 'object' && dateValue.seconds) {
    const date = new Date(dateValue.seconds * 1000);
    return date.toLocaleDateString(locale);
  }

  // Si c'est déjà une string
  if (typeof dateValue === 'string') {
    try {
      const date = new Date(dateValue);
      return date.toLocaleDateString(locale);
    } catch {
      return dateValue;
    }
  }

  // Si c'est un objet Date
  if (dateValue instanceof Date) {
    return dateValue.toLocaleDateString(locale);
  }

  return 'Date inconnue';
};

/**
 * Formate une date Firebase avec l'heure
 * @param dateValue - La valeur de date
 * @param locale - La locale pour le formatage (défaut: 'fr-FR')
 * @returns String formatée avec date et heure
 */
export const formatFirebaseDateTime = (
  dateValue: any,
  locale: string = 'fr-FR',
): string => {
  if (!dateValue) return 'Date inconnue';

  // Si c'est un timestamp Firebase
  if (dateValue && typeof dateValue === 'object' && dateValue.seconds) {
    const date = new Date(dateValue.seconds * 1000);
    return date.toLocaleString(locale);
  }

  // Si c'est une string
  if (typeof dateValue === 'string') {
    try {
      const date = new Date(dateValue);
      return date.toLocaleString(locale);
    } catch {
      return dateValue;
    }
  }

  // Si c'est un objet Date
  if (dateValue instanceof Date) {
    return dateValue.toLocaleString(locale);
  }

  return 'Date inconnue';
};

/**
 * Convertit une date Firebase en objet Date JavaScript
 * @param dateValue - La valeur de date Firebase
 * @returns Objet Date ou null si invalide
 */
export const firebaseDateToDate = (dateValue: any): Date | null => {
  if (!dateValue) return null;

  // Si c'est un timestamp Firebase
  if (dateValue && typeof dateValue === 'object' && dateValue.seconds) {
    return new Date(dateValue.seconds * 1000);
  }

  // Si c'est une string
  if (typeof dateValue === 'string') {
    try {
      return new Date(dateValue);
    } catch {
      return null;
    }
  }

  // Si c'est déjà un objet Date
  if (dateValue instanceof Date) {
    return dateValue;
  }

  return null;
};
