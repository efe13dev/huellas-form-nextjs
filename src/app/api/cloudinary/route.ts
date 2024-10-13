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
const MAX_HEIGHT = 675;
const WATERMARK_WIDTH = 60; // Añade esta línea para definir el ancho de la marca de agua
const WATERMARK_OFFSET_BOTTOM = 40; // Reduce este valor
const WATERMARK_OFFSET_RIGHT = 40; // Cambia WATERMARK_OFFSET_LEFT por WATERMARK_OFFSET_RIGHT
const WATERMARK_PATH = path.join(process.cwd(), 'public', 'marca-agua.png');
const WATERMARK_OPACITY = 0.3; // Añade esta línea para controlar la opacidad

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
          input: await sharp(WATERMARK_PATH)
            .resize(WATERMARK_WIDTH) // Redimensiona la marca de agua
            .composite([
              {
                input: Buffer.from([
                  255,
                  255,
                  255,
                  Math.round(255 * WATERMARK_OPACITY)
                ]),
                raw: { width: 1, height: 1, channels: 4 },
                tile: true,
                blend: 'dest-in'
              }
            ])
            .toBuffer(),
          gravity: 'southeast',
          top: WATERMARK_OFFSET_BOTTOM,
          left: WATERMARK_OFFSET_RIGHT
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
