// app/api/adoption/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@libsql/client";
import { TursoData } from "@/types";

const client = createClient({
  url: process.env.TURSO_DATABASE_URL ?? "",
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, description, type, size, age, photos, genre } =
      body as TursoData;

    // Validación estricta de campos requeridos
    if (!name || !description || !type || !size || !age || !genre) {
      return NextResponse.json(
        { error: "Faltan campos requeridos" },
        { status: 400 }
      );
    }

    // Validar que genre sea string y uno de los valores permitidos
    const allowedGenres = ["male", "female", "unknown"];
    const genreStr = String(genre).toLowerCase();
    if (!allowedGenres.includes(genreStr)) {
      return NextResponse.json(
        {
          error:
            'El campo "genre" debe ser uno de: ' + allowedGenres.join(", "),
        },
        { status: 400 }
      );
    }

    // Validación estricta de photos: debe ser array de strings o vacío
    if (
      photos !== undefined &&
      (!Array.isArray(photos) || photos.some((p) => typeof p !== "string"))
    ) {
      return NextResponse.json(
        { error: 'El campo "photos" debe ser un array de strings' },
        { status: 400 }
      );
    }
    const safePhotos: string[] = Array.isArray(photos)
      ? photos.filter((p) => typeof p === "string")
      : [];
    const photosJson = JSON.stringify(safePhotos);

    const result = await client.batch(
      [
        {
          sql: "INSERT INTO animals(name, description, type, size, age, photos, genre) VALUES (?,?,?,?,?,?,?)",
          args: [name, description, type, size, age, photosJson, genreStr],
        },
      ],
      "write"
    );
    return NextResponse.json(
      { message: "Adoption inserted successfully", result },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error inserting adoption:", error);
    return NextResponse.json(
      {
        error: "Failed to insert adoption",
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    console.log("[API] GET /api/adoption - Iniciando consulta a Turso");
    const result = await client.execute(
      "SELECT * FROM animals ORDER BY register_date DESC"
    );
    // Robustez extra: intenta parsear photos, si falla lo deja como []
    const safeRows = result.rows.map((row) => {
      let safePhotos: string[] = [];
      try {
        safePhotos = row.photos
          ? JSON.parse(
              typeof row.photos === "string" ? row.photos : String(row.photos)
            )
          : [];
        if (!Array.isArray(safePhotos)) safePhotos = [];
      } catch {
        safePhotos = [];
      }
      return { ...row, photos: safePhotos };
    });
    console.log(
      "[API] GET /api/adoption - Consulta completada. Filas:",
      safeRows.length
    );
    return NextResponse.json(safeRows, { status: 200 });
  } catch (error) {
    console.error("[API] Error fetching adoptions:", error);
    return NextResponse.json(
      { error: "Failed to fetch adoptions" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const body = await req.json();
  const { id } = body;

  if (!id) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    await client.batch(
      [
        {
          sql: "DELETE FROM animals WHERE id = ?",
          args: [id],
        },
      ],
      "write"
    );

    return NextResponse.json(
      { message: "Animal deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    //eslint-disable-next-line
    console.error("Error deleting animal:", error);
    return NextResponse.json(
      { error: "Failed to delete animal", details: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  const data = await req.json();

  try {
    if (data.id) {
      const updateFields = [];
      const args = [];
      const allowedFields = [
        "name",
        "description",
        "type",
        "size",
        "age",
        "genre",
        "adopted",
      ];

      for (const field of allowedFields) {
        if (data[field] !== undefined) {
          updateFields.push(`${field} = ?`);
          args.push(data[field]);
        }
      }

      if (updateFields.length === 0) {
        throw new Error("No se proporcionaron campos para actualizar");
      }

      const sql = `UPDATE animals SET ${updateFields.join(", ")} WHERE id = ?`;
      args.push(data.id);

      await client.execute({
        sql,
        args,
      });

      return NextResponse.json(
        { message: "Animal actualizado exitosamente" },
        { status: 200 }
      );
    } else {
      throw new Error("Se requiere el campo ID");
    }
  } catch (error) {
    // eslint-disable-next-line
    console.error("Error al actualizar el animal:", error);
    return NextResponse.json(
      {
        error: "Error al actualizar el animal",
        message: (error as { message: string }).message,
      },
      { status: 500 }
    );
  }
}
