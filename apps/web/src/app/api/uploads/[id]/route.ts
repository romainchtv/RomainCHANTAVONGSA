import { NextResponse } from "next/server";
import { getDb } from "@/app/lib/db";

export const runtime = "nodejs";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolved = await Promise.resolve(params as unknown as { id: string });
    const id = Number(resolved.id);
    if (!id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const db = getDb();
    const [rows] = await db.execute(
      "SELECT mime, data FROM uploads WHERE id = ?",
      [id]
    );
    const list = rows as { mime: string; data: Buffer }[];
    const file = list[0];

    if (!file) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const body = file.data.buffer.slice(
      file.data.byteOffset,
      file.data.byteOffset + file.data.byteLength
    );

    return new NextResponse(body, {
      status: 200,
      headers: {
        "Content-Type": file.mime,
        "Cache-Control": "public, max-age=31536000, immutable"
      }
    });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
