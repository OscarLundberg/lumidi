import { C } from "./musical-symbols";

export const CONFIG = {
  tempo: 100,
  key: C,
  ticksPerQuarter: 480
}

/**
 * 
 * @returns {number} multiply with a note value to get actual duration in microseconds
 */
export const microSecondsPerWhole = () => (4 * (60 / CONFIG.tempo) * (10 ** 6));