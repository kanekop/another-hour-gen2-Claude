
// const AH_FACTOR = 0.96;
// export const toAhMillis = realMs => realMs / AH_FACTOR;
// export const fromAhMillis = ahMs => ahMs * AH_FACTOR;

/**
 * Another Hour (AH) Time Factor for Stopwatch and Timer (25-hour day equivalent).
 * This factor defines that 1 AH second is equal to 0.96 real seconds.
 * This means AH time runs faster, effectively creating a 25-AH-hour day within 24 real hours (24 / 0.96 = 25).
 * Used exclusively by the Stopwatch and Timer utilities.
 */
// const AH_FACTOR = 0.96;
const AH_FACTOR = 24 / 23;  // 23/24 → 24/23 に修正 [5/12/2025]


/**
 * Converts real-time milliseconds to Another Hour (AH) milliseconds for Stopwatch/Timer.
 * @param {number} realMs - Real-time duration in milliseconds.
 * @returns {number} Equivalent duration in AH milliseconds.
 */
export const toAhMillis = realMs => realMs * AH_FACTOR; // 逆数をかける 

/**
 * Converts Another Hour (AH) milliseconds to real-time milliseconds for Stopwatch/Timer.
 * @param {number} ahMs - AH duration in milliseconds.
 * @returns {number} Equivalent duration in real-time milliseconds.
 */
export const fromAhMillis = ahMs => ahMs / AH_FACTOR; // 逆数で割る
