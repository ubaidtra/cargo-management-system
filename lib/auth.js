/**
 * Check if a username is the super admin
 * @param {string} username - Username to check
 * @returns {boolean}
 */
export function isSuperAdmin(username) {
  return username === 'ubaidtra';
}

/**
 * Check if a user ID is the super admin
 * @param {string} userId - User ID to check (can be '0' for default admin or actual ID)
 * @param {string} username - Username to check
 * @returns {boolean}
 */
export function isSuperAdminById(userId, username) {
  // Default admin has ID '0' and username 'ubaidtra'
  if (userId === '0' || userId === 0) {
    return true;
  }
  return username === 'ubaidtra';
}

/**
 * Check if a user object is super admin
 * @param {object} user - User object with id and/or username
 * @returns {boolean}
 */
export function isSuperAdminUser(user) {
  if (!user) return false;
  return isSuperAdmin(user.username) || isSuperAdminById(user.id, user.username);
}
