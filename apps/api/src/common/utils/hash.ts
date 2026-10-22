import { compare, hash as bcryptHash } from 'bcrypt';

const SALT_ROUNDS = 10;

export function hash(value: string): Promise<string> {
  return bcryptHash(value, SALT_ROUNDS);
}

export function compareHash(value: string, hashed: string): Promise<boolean> {
  return compare(value, hashed);
}
