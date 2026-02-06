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
      "SELECT id, name, level, category, sort_order FROM skills WHERE locale = ? ORDER BY sort_order ASC, id ASC",
      [locale]
    );
    return NextResponse.json({ items: rows });
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
    const name = String(body?.name ?? "").trim();
    const level = String(body?.level ?? "").trim() || null;
    const category = String(body?.category ?? "").trim() || null;
    const sortOrder = Number(body?.sortOrder ?? 0) || 0;

    if (!name) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      );
    }

    const db = getDb();
    await db.execute(
      "INSERT INTO skills (locale, name, level, category, sort_order) VALUES (?, ?, ?, ?, ?)",
      [locale, name, level, category, sortOrder]
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
    const name = String(body?.name ?? "").trim();
    const level = String(body?.level ?? "").trim() || null;
    const category = String(body?.category ?? "").trim() || null;
    const sortOrder = Number(body?.sortOrder ?? 0) || 0;

    if (!id || !name) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      );
    }

    const db = getDb();
    await db.execute(
      "UPDATE skills SET name = ?, level = ?, category = ?, sort_order = ? WHERE id = ?",
      [name, level, category, sortOrder, id]
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
    await db.execute("DELETE FROM skills WHERE id = ?", [id]);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
