import { randomInt } from 'node:crypto';

/** A numeric one-time code from a cryptographically secure source. */
export function generateOtp(length = 5): string {
  return randomInt(0, 10 ** length)
    .toString()
    .padStart(length, '0');
}
