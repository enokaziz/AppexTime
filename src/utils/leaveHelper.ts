import { Leave } from '../types/index';

/**
 * Calculate the total duration of a leave in days.
 * @param leave - The leave object.
 * @returns The total duration in days.
 */
export const calculateLeaveDuration = (leave: Leave): number => {
  const startDate = new Date(leave.startDate);
  const endDate = new Date(leave.endDate);
  const duration = endDate.getTime() - startDate.getTime();
  return duration / (1000 * 60 * 60 * 24);
};

/**
 * Check if a leave overlaps with another leave.
 * @param leave1 - The first leave object.
 * @param leave2 - The second leave object.
 * @returns True if the leaves overlap, false otherwise.
 */
export const isLeaveOverlapping = (leave1: Leave, leave2: Leave): boolean => {
  const startDate1 = new Date(leave1.startDate);
  const endDate1 = new Date(leave1.endDate);
  const startDate2 = new Date(leave2.startDate);
  const endDate2 = new Date(leave2.endDate);

  return (
    (startDate1 <= endDate2 && endDate1 >= startDate2) ||
    (startDate2 <= endDate1 && endDate2 >= startDate1)
  );
};

/**
 * Format leave data for better readability.
 * @param leave - The leave object.
 * @returns Formatted leave data.
 */
export const formatLeaveData = (leave: Leave): string => {
  return `Leave ID: ${leave.id}\nStart Date: ${leave.startDate}\nEnd Date: ${leave.endDate}\nReason: ${leave.reason}`;
};
