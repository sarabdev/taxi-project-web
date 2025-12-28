/**
 * Safe Local Storage Helpers
 * --------------------------
 * - JSON parse safety
 * - Centralized storage access
 * - Easy to replace with cookies / IndexedDB later
 */

export const readJSON = (key, fallback = null) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (error) {
    console.error(`readJSON failed for key "${key}"`, error);
    return fallback;
  }
};

export const writeJSON = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`writeJSON failed for key "${key}"`, error);
    return false;
  }
};

export const removeKey = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`removeKey failed for key "${key}"`, error);
    return false;
  }
};
