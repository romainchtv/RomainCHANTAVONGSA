import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { getDb } from "@/app/lib/db";
import { isAdminFromCookie } from "@/app/lib/admin-auth";

function normalizeLocale(value: unknown) {
  return value === "en" ? "en" : "fr";
}

async function requireAdmin() {
  const headerList = await headers();
  return isAdminFromCookie(headerList.get("cookie"));
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const locale = normalizeLocale(searchParams.get("lang"));
    const db = getDb();
    const [rows] = await db.execute(
      "SELECT id, content, updated_at FROM about WHERE locale = ? ORDER BY updated_at DESC, id DESC LIMIT 1",
      [locale]
    );
    const list = rows as { id: number; content: string }[];
    return NextResponse.json({ item: list[0] ?? null });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    if (!(await requireAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const locale = normalizeLocale(body?.locale ?? body?.lang);
    const content = String(body?.content ?? "").trim();

    if (!content) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      );
    }

    const db = getDb();
    await db.execute(
      "INSERT INTO about (locale, content) VALUES (?, ?)",
      [locale, content]
    );

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    if (!(await requireAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const id = Number(body?.id ?? 0);
    const content = String(body?.content ?? "").trim();

    if (!id || !content) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      );
    }

    const db = getDb();
    await db.execute(
      "UPDATE about SET content = ? WHERE id = ?",
      [content, id]
    );

    return NextResponse.json({ ok: true });
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
      return NextResponse.json(
        { error: "Missing id" },
        { status: 400 }
      );
    }

    const db = getDb();
    await db.execute("DELETE FROM about WHERE id = ?", [id]);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
