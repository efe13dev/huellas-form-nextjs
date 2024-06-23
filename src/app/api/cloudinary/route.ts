import { NextRequest, NextResponse } from 'next/server';

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

    console.log('Imagen recibida:', image.name);
    console.log('Tamaño del buffer:', buffer.length);

    // Aquí puedes agregar la lógica para subir el buffer a Cloudinary o cualquier otro servicio

    return NextResponse.json('Imagen subida exitosamente');
  } catch (error) {
    console.error('Error al procesar la imagen:', error);
    return NextResponse.json('Error al procesar la imagen', { status: 500 });
  }
}
