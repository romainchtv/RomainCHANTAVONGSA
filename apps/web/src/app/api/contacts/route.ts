import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { getDb } from "@/app/lib/db";
import { isAdminFromCookie } from "@/app/lib/admin-auth";

async function requireAdmin() {
  const headerList = await headers();
  return isAdminFromCookie(headerList.get("cookie"));
}

export async function GET() {
  try {
    if (!(await requireAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = getDb();
    const [rows] = await db.execute(
      "SELECT id, name, email, message, created_at FROM contacts ORDER BY created_at DESC, id DESC"
    );
    return NextResponse.json({ items: rows });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    if (!(await requireAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get("id") ?? 0);
    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    const db = getDb();
    await db.execute("DELETE FROM contacts WHERE id = ?", [id]);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
