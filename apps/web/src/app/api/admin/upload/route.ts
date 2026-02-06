import { NextResponse } from "next/server";
import { headers } from "next/headers";
import type { ResultSetHeader } from "mysql2/promise";
import { getDb } from "@/app/lib/db";
import { isAdminFromCookie } from "@/app/lib/admin-auth";

export const runtime = "nodejs";

async function requireAdmin() {
  const headerList = await headers();
  return isAdminFromCookie(headerList.get("cookie"));
}

export async function POST(req: Request) {
  try {
    if (!(await requireAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file" }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: "File too large" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const db = getDb();
    const [result] = await db.execute(
      "INSERT INTO uploads (filename, mime, size, data) VALUES (?, ?, ?, ?)",
      [file.name, file.type, file.size, buffer]
    );

    const insertId = (result as ResultSetHeader).insertId;
    return NextResponse.json({ url: `/api/uploads/${insertId}` });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
