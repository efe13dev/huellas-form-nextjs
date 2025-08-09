// app/api/news/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@libsql/client";

import { NewsType } from "@/types";

const client = createClient({
  url: process.env.TURSO_DATABASE_URL ?? "",
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export async function GET(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const { id } = params;

    const result = await client.execute({
      sql: "SELECT * FROM news WHERE id = ?",
      args: [id],
    });

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Noticia no encontrada" }, { status: 404 });
    }

    return NextResponse.json(result.rows[0], { status: 200 });
  } catch (error) {
    console.error("Error fetching news:", error);

    return NextResponse.json({ error: "Error al obtener la noticia" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const { id } = params;
    const body = await req.json();
    const { title, content, type } = body as Partial<NewsType>;

    // Construir la consulta dinámicamente (solo título y contenido)
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
    if (type !== undefined) {
      updates.push("type = ?");
      args.push(type);
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: "No hay campos para actualizar" }, { status: 400 });
    }

    args.push(id);
    const sql = `UPDATE news SET ${updates.join(", ")} WHERE id = ?`;

    await client.execute({
      sql,
      args,
    });

    // Obtener la noticia actualizada
    const result = await client.execute({
      sql: "SELECT * FROM news WHERE id = ?",
      args: [id],
    });

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Noticia no encontrada después de la actualización" },
        { status: 404 },
      );
    }

    return NextResponse.json(result.rows[0], { status: 200 });
  } catch (error) {
    console.error("Error updating news:", error);

    return NextResponse.json({ error: "Error al actualizar la noticia" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const { id } = params;

    const result = await client.execute({
      sql: "DELETE FROM news WHERE id = ?",
      args: [id],
    });

    if (result.rowsAffected === 0) {
      return NextResponse.json({ error: "Noticia no encontrada" }, { status: 404 });
    }

    return NextResponse.json({ message: "Noticia eliminada exitosamente" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting news:", error);

    return NextResponse.json({ error: "Error al eliminar la noticia" }, { status: 500 });
  }
}
