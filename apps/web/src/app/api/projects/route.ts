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
      "SELECT id, title, subtitle, description, stack, url, image_url, start_date, end_date, sort_order FROM projects WHERE locale = ? ORDER BY sort_order ASC, start_date DESC, id DESC",
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
    const title = String(body?.title ?? "").trim();
    const subtitle = String(body?.subtitle ?? "").trim() || null;
    const description = String(body?.description ?? "").trim() || null;
    const stack = String(body?.stack ?? "").trim() || null;
    const url = String(body?.url ?? "").trim() || null;
    const imageUrl = String(body?.imageUrl ?? "").trim() || null;
    const startDate = String(body?.startDate ?? "").trim() || null;
    const endDate = String(body?.endDate ?? "").trim() || null;
    const sortOrder = Number(body?.sortOrder ?? 0) || 0;

    if (!title) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      );
    }

    const db = getDb();
    await db.execute(
      "INSERT INTO projects (locale, title, subtitle, description, stack, url, image_url, start_date, end_date, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        locale,
        title,
        subtitle,
        description,
        stack,
        url,
        imageUrl,
        startDate,
        endDate,
        sortOrder
      ]
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
    const title = String(body?.title ?? "").trim();
    const subtitle = String(body?.subtitle ?? "").trim() || null;
    const description = String(body?.description ?? "").trim() || null;
    const stack = String(body?.stack ?? "").trim() || null;
    const url = String(body?.url ?? "").trim() || null;
    const imageUrl = String(body?.imageUrl ?? "").trim() || null;
    const startDate = String(body?.startDate ?? "").trim() || null;
    const endDate = String(body?.endDate ?? "").trim() || null;
    const sortOrder = Number(body?.sortOrder ?? 0) || 0;

    if (!id || !title) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      );
    }

    const db = getDb();
    await db.execute(
      "UPDATE projects SET title = ?, subtitle = ?, description = ?, stack = ?, url = ?, image_url = ?, start_date = ?, end_date = ?, sort_order = ? WHERE id = ?",
      [
        title,
        subtitle,
        description,
        stack,
        url,
        imageUrl,
        startDate,
        endDate,
        sortOrder,
        id
      ]
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
    await db.execute("DELETE FROM projects WHERE id = ?", [id]);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
