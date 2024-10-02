import path from 'path';
import { writeFile, unlink } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import sharp from 'sharp';

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

    const filePath = path.join(process.cwd(), 'public', image.name);
    const outputFilePath = path.join(
      process.cwd(),
      'public',
      'resized-' + image.name
    );

    await writeFile(filePath, buffer);

    const metadata = await sharp(filePath).metadata();
    let width = metadata.width;
    let height = metadata.height || 0;

    try {
      if (width && width > MAX_WIDTH) {
        width = MAX_WIDTH;
        height = MAX_HEIGHT;
      }
      const watermarkPath = path.join(
        process.cwd(),
        'public',
        'marca-agua.png'
      );
      await sharp(filePath)
        .resize(width, height)
        .composite([
          {
            input: watermarkPath,
            top: height - WATERMARK_OFFSET_BOTTOM,
            left: WATERMARK_OFFSET_LEFT
          }
        ])
        .toFormat('webp')
        .toFile(outputFilePath);
    } catch (error) {
      // eslint-disable-next-line
      console.error('Error resizing the image:', error);
    }

    // Subir la imagen a Cloudinary
    const response = await cloudinary.uploader.upload(outputFilePath);

    // Eliminar la imagen de la carpeta public después de subirla a Cloudinary
    await unlink(filePath);
    await unlink(outputFilePath);

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
