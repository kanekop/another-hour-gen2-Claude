// src/shared/ah-time.js

/**
 * Used exclusively by the Stopwatch and Timer utilities.
 */
const AH_FACTOR = 23/24;

/**
 * Converts real-time milliseconds to Another Hour (AH) milliseconds for Stopwatch/Timer.
 * @param {number} realMs - Real-time duration in milliseconds.
 * @returns {number} Equivalent duration in AH milliseconds.
 */
export const toAhMillis = realMs => realMs / AH_FACTOR;

/**
 * Converts Another Hour (AH) milliseconds to real-time milliseconds for Stopwatch/Timer.
 * @param {number} ahMs - AH duration in milliseconds.
 * @returns {number} Equivalent duration in real-time milliseconds.
 */
export const fromAhMillis = ahMs => ahMs * AH_FACTOR;