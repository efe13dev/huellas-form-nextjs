// app/api/adoption/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@libsql/client';
import { TursoData } from '@/types';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL ?? '',
  authToken: process.env.TURSO_AUTH_TOKEN
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  console.log('Request body:', body);
  const { name, description, type, size, age } = body as TursoData;
  const photo = 'default-image';

  if (!name || !description || !type || !size || !age) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    );
  }

  try {
    const result = await client.batch(
      [
        {
          sql: 'INSERT INTO animals(name, description, type, size, age, photos) VALUES (?,?,?,?,?,?)',
          args: [name, description, type, size, age, photo]
        }
      ],
      'write'
    );
    return NextResponse.json(
      { message: 'Adoption inserted successfully', result },
      { status: 200 }
    );
  } catch (error) {
    // eslint-disable-next-line
    console.error('Error inserting adoption:', error);
    return NextResponse.json(
      {
        error: 'Failed to insert adoption',
        details: (error as Error).message
      },
      { status: 500 }
    );
  }
}

export async function get() {
  return NextResponse.json(
    { message: 'This endpoint only supports POST requests' },
    { status: 405 }
  );
}
