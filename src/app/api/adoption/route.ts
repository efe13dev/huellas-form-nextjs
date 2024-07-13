// app/api/adoption/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@libsql/client';
import { TursoData } from '@/types';
import { Rows } from 'lucide-react';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL ?? '',
  authToken: process.env.TURSO_AUTH_TOKEN
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, description, type, size, age, photos } = body as TursoData;
  //const photos = 'default-image';

  if (!name || !description || !type || !size || !age) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    );
  }
  if (photos) {
    const photosJson = JSON.stringify(photos);
    try {
      const result = await client.batch(
        [
          {
            sql: 'INSERT INTO animals(name, description, type, size, age, photos) VALUES (?,?,?,?,?,?)',
            args: [name, description, type, size, age, photosJson]
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
}

export async function GET() {
  try {
    const result = await client.execute(
      'SELECT * FROM animals ORDER BY id DESC'
    );

    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    // eslint-disable-next-line
    console.error('Error fetching adoptions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch adoptions' },
      { status: 500 }
    );
  }
}
