import { createClient } from '@libsql/client';
import { TursoData } from '@/types';

const client = createClient({
  url: process.env.NEXT_PUBLIC_TURSO_DATABASE_URL ?? '',
  authToken: process.env.NEXT_PUBLIC_TURSO_AUTH_TOKEN
});

export async function insertAdoption(newpet: TursoData): Promise<any> {
  const { name, description, type, size, age } = newpet;
  const photo = 'default-image';
  const result = await client.batch(
    [
      {
        sql: 'INSERT INTO animals(name, description, type, size, age, photos) VALUES (?,?,?,?,?,?)',
        args: [name, description, type, size, age, photo]
      }
    ],
    'write'
  );
  return result;
}
