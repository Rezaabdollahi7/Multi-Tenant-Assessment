import { randomInt } from 'node:crypto';

export function generateOtp(length = 5): string {
  return randomInt(0, 10 ** length)
    .toString()
    .padStart(length, '0');
}
