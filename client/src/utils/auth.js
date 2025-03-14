import { auth } from "../firebase/firebase.config";

/**
 * Gets the current user's ID token
 * @returns {Promise<string|null>} The ID token or null if no user is signed in
 */
export const getIdToken = async () => {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    return null;
  }
  return await currentUser.getIdToken(true);
};

/**
 * Utility to access the current Firebase user
 * @returns {object|null} The current Firebase user or null
 */
export const getCurrentUser = () => {
  return auth.currentUser;
};
