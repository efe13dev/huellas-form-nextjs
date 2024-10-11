import path from 'path';
import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import sharp from 'sharp';
import { UploadApiResponse } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const MAX_WIDTH = 900;
const MAX_HEIGHT = 600;
const WATERMARK_OFFSET_BOTTOM = 100;
const WATERMARK_OFFSET_LEFT = 50;
const WATERMARK_PATH = path.join(process.cwd(), 'public', 'marca-agua.png');

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const image = data.get('file');

    if (!image || !(image instanceof File)) {
      return NextResponse.json('No se subió una imagen válida', {
        status: 400
      });
    }

    const buffer = Buffer.from(await image.arrayBuffer());

    // Procesar la imagen en memoria
    const processedBuffer = await sharp(buffer)
      .resize(MAX_WIDTH, MAX_HEIGHT, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .composite([
        {
          input: WATERMARK_PATH,
          gravity: 'southeast',
          top: WATERMARK_OFFSET_BOTTOM,
          left: WATERMARK_OFFSET_LEFT
        }
      ])
      .webp()
      .toBuffer();

    // Subir la imagen procesada a Cloudinary
    const response = await uploadToCloudinary(processedBuffer);

    return NextResponse.json({
      message: 'Imagen subida',
      url: response.secure_url
    });
  } catch (error) {
    return handleError(error, 'Error al procesar la imagen');
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { public_id } = await request.json();

    if (!public_id) {
      return NextResponse.json(
        { error: 'Se requiere el ID público' },
        { status: 400 }
      );
    }

    const result = await cloudinary.uploader.destroy(public_id);

    if (result.result === 'ok') {
      return NextResponse.json({ message: 'Imagen eliminada con éxito' });
    } else {
      return NextResponse.json(
        { error: 'No se pudo eliminar la imagen', details: result },
        { status: 500 }
      );
    }
  } catch (error) {
    return handleError(error, 'Error al eliminar la imagen');
  }
}

// Funciones auxiliares
async function uploadToCloudinary(buffer: Buffer): Promise<UploadApiResponse> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ resource_type: 'auto' }, (error, result) => {
        if (error) reject(error);
        else if (result) resolve(result);
        else reject(new Error('Resultado de carga indefinido'));
      })
      .end(buffer);
  });
}

function handleError(error: unknown, defaultMessage: string): NextResponse {
  // eslint-disable-next-line
  console.error(defaultMessage + ':', error);
  if (error instanceof Error) {
    return NextResponse.json(
      { error: defaultMessage, details: error.message },
      { status: 500 }
    );
  }
  return NextResponse.json(
    { error: 'Error desconocido: ' + defaultMessage },
    { status: 500 }
  );
}
