import prisma from './prisma';

/**
 * Log an activity to the database
 * @param {string} action - The action performed (e.g., 'CREATE_USER', 'DELETE_USER', 'LOGIN')
 * @param {string|null} userId - ID of the user who performed the action
 * @param {string|null} username - Username for reference
 * @param {string|null} details - Additional details about the action
 */
export async function logActivity(action, userId = null, username = null, details = null) {
  try {
    await prisma.activityLog.create({
      data: {
        action,
        userId,
        username,
        details,
      },
    });
  } catch (error) {
    console.error('Failed to log activity:', error);
    // Don't throw - logging failures shouldn't break the app
  }
}

