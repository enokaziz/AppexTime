import { Notification } from '../types/index';
import { NOTIFICATION_API_URL } from '../utils/constants';

let leaveStatusChangeCallbacks: ((status: string) => void)[] = [];

/**
 * Format the notification message for better readability.
 * @param notification - The notification object.
 * @returns Formatted notification message.
 */
export const formatNotificationMessage = (notification: Notification): string => {
  return `Notification ID: ${notification.id}\nTitle: ${notification.title}\nMessage: ${notification.message}\nDate: ${notification.date}`;
};

/**
 * Send a notification to a specific user.
 * @param userId - The ID of the user to send the notification to.
 * @param notification - The notification object.
 * @returns A promise that resolves when the notification is sent.
 */
export const sendNotificationToUser = async (userId: string, notification: Notification): Promise<void> => {
  try {
    const response = await fetch(`${NOTIFICATION_API_URL}/users/${userId}/notifications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(notification),
    });
    if (!response.ok) {
      throw new Error('Failed to send notification');
    }
  } catch (error) {
    console.error('Error sending notification:', error);
    throw error;
  }
};

/**
 * Log a notification in the system.
 * @param notification - The notification object.
 * @returns A promise that resolves when the notification is logged.
 */
export const logNotification = async (notification: Notification): Promise<void> => {
  try {
    const response = await fetch(`${NOTIFICATION_API_URL}/logs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(notification),
    });
    if (!response.ok) {
      throw new Error('Failed to log notification');
    }
  } catch (error) {
    console.error('Error logging notification:', error);
    throw error;
  }
};

/**
 * Subscribe to leave status change notifications.
 * @param callback - The callback to be called when the leave status changes.
 */
export const onLeaveStatusChange = (callback: (status: string) => void) => {
  leaveStatusChangeCallbacks.push(callback);
  return () => {
    leaveStatusChangeCallbacks = leaveStatusChangeCallbacks.filter(cb => cb !== callback);
  };
};

/**
 * Notify all subscribers of a leave status change.
 * @param status - The new status of the leave.
 */
export const notifyLeaveStatusChange = (status: string) => {
  leaveStatusChangeCallbacks.forEach(callback => callback(status));
};
