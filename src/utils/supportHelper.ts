import { SupportRequest } from '../types/index';
import { SUPPORT_API_URL } from '../utils/constants';

/**
 * Format the support request data for better readability.
 * @param supportRequest - The support request object.
 * @returns Formatted support request data.
 */
export const formatSupportRequest = (supportRequest: SupportRequest): string => {
  return `Support Request ID: ${supportRequest.id}\nTitle: ${supportRequest.title}\nDescription: ${supportRequest.description}\nDate: ${supportRequest.date}`;
};

/**
 * Check if a support request is urgent.
 * @param supportRequest - The support request object.
 * @returns True if the support request is urgent, false otherwise.
 */
export const isSupportRequestUrgent = (supportRequest: SupportRequest): boolean => {
  return supportRequest.priority === 'high';
};

/**
 * Log a support request in the system.
 * @param supportRequest - The support request object.
 * @returns A promise that resolves when the support request is logged.
 */
export const logSupportRequest = async (supportRequest: SupportRequest): Promise<void> => {
  try {
    const response = await fetch(`${SUPPORT_API_URL}/logs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(supportRequest),
    });
    if (!response.ok) {
      throw new Error('Failed to log support request');
    }
  } catch (error) {
    console.error('Error logging support request:', error);
    throw error;
  }
};
