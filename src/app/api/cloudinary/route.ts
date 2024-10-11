import path from 'path';
import { writeFile, unlink } from 'fs/promises';
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

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const image = data.get('file');

    if (!image || !(image instanceof File)) {
      return NextResponse.json('No valid image was uploaded', {
        status: 400
      });
    }

    const arrayBuffer = await image.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Procesar la imagen en memoria
    let processedBuffer = await sharp(buffer)
      .resize(MAX_WIDTH, MAX_HEIGHT, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .webp()
      .toBuffer();

    // Añadir marca de agua
    const watermarkPath = path.join(process.cwd(), 'public', 'marca-agua.png');
    processedBuffer = await sharp(processedBuffer)
      .composite([
        {
          input: watermarkPath,
          gravity: 'southeast',
          top: WATERMARK_OFFSET_BOTTOM,
          left: WATERMARK_OFFSET_LEFT
        }
      ])
      .toBuffer();

    // Subir la imagen procesada a Cloudinary
    const response = (await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ resource_type: 'auto' }, (error, result) => {
          if (error) reject(error);
          else if (result) resolve(result);
          else reject(new Error('Resultado de carga indefinido'));
        })
        .end(processedBuffer);
    })) as UploadApiResponse;

    return NextResponse.json({
      message: 'Imagen subida',
      url: response.secure_url
    });
  } catch (error) {
    // eslint-disable-next-line
    console.error('Error processing the image:', error);
    if (error instanceof Error) {
      return NextResponse.json(`Error processing the image: ${error.message}`, {
        status: 500
      });
    }
    return NextResponse.json('Unknown error processing the image', {
      status: 500
    });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { public_id } = await request.json();

    if (!public_id) {
      return NextResponse.json(
        { error: 'Public ID is required' },
        { status: 400 }
      );
    }

    const result = await cloudinary.uploader.destroy(public_id);

    if (result.result === 'ok') {
      return NextResponse.json({ message: 'Image deleted successfully' });
    } else {
      return NextResponse.json(
        { error: 'Failed to delete image', details: result },
        { status: 500 }
      );
    }
  } catch (error) {
    // eslint-disable-next-line
    console.error('Error deleting the image:', error);
    if (error instanceof Error) {
      return NextResponse.json(
        {
          error: 'An error occurred while deleting the image',
          details: error.message
        },
        { status: 500 }
      );
    }
    return NextResponse.json(
      {
        error: 'An unknown error occurred while deleting the image'
      },
      { status: 500 }
    );
  }
}
