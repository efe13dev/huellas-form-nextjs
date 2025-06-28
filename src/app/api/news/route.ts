// app/api/news/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@libsql/client";
import { NewsType } from "@/types";

const client = createClient({
  url: process.env.TURSO_DATABASE_URL ?? "",
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, content, image } =
      body as Omit<NewsType, 'id' | 'date'>;

    if (!title || !content || !image) {
      return NextResponse.json(
        { error: "Faltan campos requeridos" },
        { status: 400 }
      );
    }

    const result = await client.batch(
      [
        {
          sql: "INSERT INTO news(title, content, image, date) VALUES (?,?,?,?)",
          args: [title, content, image, new Date().toISOString()],
        },
      ],
      "write"
    );
    return NextResponse.json(
      { message: "News inserted successfully", result },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error inserting news:", error);
    return NextResponse.json(
      {
        error: "Failed to insert news",
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    console.log("[API] GET /api/news - Iniciando consulta a Turso");
    const result = await client.execute(
      "SELECT * FROM news ORDER BY date DESC"
    );
    console.log(
      "[API] GET /api/news - Consulta completada. Filas:",
      result.rows.length
    );
    console.log("[API] GET /api/news - Datos:", result.rows);
    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error("[API] Error fetching news:", error);
    return NextResponse.json(
      { error: "Failed to fetch news" },
      { status: 500 }
    );
  }
}
