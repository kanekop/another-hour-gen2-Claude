
/**
 * Convert real milliseconds to scaled milliseconds based on scale factor
 * @param {number} realMs - Real time milliseconds
 * @param {number} scaleFactor - Time scale factor to apply
 * @returns {number} Scaled milliseconds
 */
export const convertToScaledMs = (realMs, scaleFactor) => {
  if (scaleFactor === 0) return realMs;
  if (scaleFactor === Infinity) return 0;
  return realMs * scaleFactor;
};

/**
 * Convert scaled milliseconds back to real milliseconds
 * @param {number} scaledMs - Scaled time milliseconds
 * @param {number} scaleFactor - Time scale factor that was applied
 * @returns {number} Real milliseconds
 */
export const convertFromScaledMs = (scaledMs, scaleFactor) => {
  if (scaleFactor === 0 || scaleFactor === Infinity) return scaledMs;
  return scaledMs / scaleFactor;
};
