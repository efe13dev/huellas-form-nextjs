import path from 'path';
import { writeFile } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});
export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const image = data.get('file');

    if (!image || typeof image === 'string') {
      return NextResponse.json('No se ha subido ninguna imagen', {
        status: 400
      });
    }

    const arrayBuffer = await image.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const filePath = path.join(process.cwd(), 'public', image.name);
    await writeFile(filePath, buffer);
    // Aquí puedes agregar la lógica para subir el buffer a Cloudinary o cualquier otro servicio
    const response = await cloudinary.uploader.upload(filePath);

    return NextResponse.json({
      message: 'imagen subida',
      url: response.secure_url
    });
  } catch (error) {
    console.error('Error al procesar la imagen:', error);
    return NextResponse.json('Error al procesar la imagen', { status: 500 });
  }
}
