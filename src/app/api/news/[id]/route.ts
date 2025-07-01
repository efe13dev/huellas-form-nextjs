// app/api/news/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@libsql/client";
import { NewsType } from "@/types";
import { v2 as cloudinary } from "cloudinary";

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const client = createClient({
  url: process.env.TURSO_DATABASE_URL ?? "",
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const result = await client.execute({
      sql: "SELECT * FROM news WHERE id = ?",
      args: [id],
    });

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Noticia no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0], { status: 200 });
  } catch (error) {
    console.error("Error fetching news:", error);
    return NextResponse.json(
      { error: "Error al obtener la noticia" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { title, content, image } = body as Partial<NewsType>;

    // Si hay una nueva imagen, obtener la imagen actual para eliminarla de Cloudinary
    let oldImageUrl = null;
    if (image !== undefined) {
      const currentResult = await client.execute({
        sql: "SELECT image FROM news WHERE id = ?",
        args: [id],
      });
      
      if (currentResult.rows.length > 0) {
        oldImageUrl = currentResult.rows[0].image as string;
      }
    }

    // Construir la consulta dinámicamente
    const updates: string[] = [];
    const args: any[] = [];

    if (title !== undefined) {
      updates.push("title = ?");
      args.push(title);
    }
    if (content !== undefined) {
      updates.push("content = ?");
      args.push(content);
    }
    if (image !== undefined) {
      updates.push("image = ?");
      args.push(image);
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { error: "No hay campos para actualizar" },
        { status: 400 }
      );
    }

    args.push(id);
    const sql = `UPDATE news SET ${updates.join(", ")} WHERE id = ?`;

    await client.execute({
      sql,
      args,
    });

    // Si había una imagen anterior y se actualizó con una nueva, eliminar la anterior de Cloudinary
    if (oldImageUrl && image && oldImageUrl !== image) {
      try {
        // Extraer el public_id de la URL de Cloudinary
        // URL típica: https://res.cloudinary.com/cloud_name/image/upload/v1234567890/public_id.jpg
        const urlParts = oldImageUrl.split('/');
        const uploadIndex = urlParts.findIndex(part => part === 'upload');
        let publicId: string;
        
        if (uploadIndex !== -1 && uploadIndex + 2 < urlParts.length) {
          // Saltar 'upload' y la versión (v1234567890) para obtener el public_id
          const fileWithExtension = urlParts[uploadIndex + 2];
          publicId = fileWithExtension.split('.')[0];
        } else {
          // Fallback al método anterior si no se encuentra la estructura esperada
          const fileWithExtension = urlParts[urlParts.length - 1];
          publicId = fileWithExtension.split('.')[0];
        }
        
        // Eliminar de Cloudinary directamente
        const result = await cloudinary.uploader.destroy(publicId);
        
        if (result.result !== 'ok') {
          console.error('Error eliminando imagen anterior de Cloudinary:', result);
        }
      } catch (cloudinaryError) {
        console.error('Error al eliminar imagen anterior:', cloudinaryError);
        // No fallar la actualización si no se puede eliminar la imagen anterior
      }
    }

    // Obtener la noticia actualizada
    const result = await client.execute({
      sql: "SELECT * FROM news WHERE id = ?",
      args: [id],
    });

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Noticia no encontrada después de la actualización" },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0], { status: 200 });
  } catch (error) {
    console.error("Error updating news:", error);
    return NextResponse.json(
      { error: "Error al actualizar la noticia" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const result = await client.execute({
      sql: "DELETE FROM news WHERE id = ?",
      args: [id],
    });

    if (result.rowsAffected === 0) {
      return NextResponse.json(
        { error: "Noticia no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Noticia eliminada exitosamente" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting news:", error);
    return NextResponse.json(
      { error: "Error al eliminar la noticia" },
      { status: 500 }
    );
  }
}
