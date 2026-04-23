import * as bcrypt from 'bcrypt';

export async function hashPassword(plainPassword: string, rounds: number) {
  return bcrypt.hash(plainPassword, rounds);
}

export async function comparePassword(plainPassword: string, hash: string) {
  return bcrypt.compare(plainPassword, hash);
}
