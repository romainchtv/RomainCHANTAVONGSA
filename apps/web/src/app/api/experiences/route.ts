import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { getDb } from "@/app/lib/db";
import { isAdminFromCookie } from "@/app/lib/admin-auth";

function normalizeLocale(value: unknown) {
  return value === "en" ? "en" : "fr";
}

async function requireAdmin() {
  const headerList = await headers();
  const ok = isAdminFromCookie(headerList.get("cookie"));
  return ok;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const locale = normalizeLocale(searchParams.get("lang"));
    const db = getDb();
    const [rows] = await db.execute(
      "SELECT id, role, company, location, start_date, end_date, is_current, description, sort_order FROM experiences WHERE locale = ? ORDER BY sort_order ASC, start_date DESC, id DESC",
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
    const role = String(body?.role ?? "").trim();
    const company = String(body?.company ?? "").trim();
    const location = String(body?.location ?? "").trim() || null;
    const description = String(body?.description ?? "").trim() || null;
    const startDate = String(body?.startDate ?? "").trim() || null;
    const endDate = String(body?.endDate ?? "").trim() || null;
    const isCurrent = body?.isCurrent ? 1 : 0;
    const sortOrder = Number(body?.sortOrder ?? 0) || 0;

    if (!role || !company) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      );
    }

    const db = getDb();
    await db.execute(
      "INSERT INTO experiences (locale, role, company, location, start_date, end_date, is_current, description, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [locale, role, company, location, startDate, endDate, isCurrent, description, sortOrder]
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
    const role = String(body?.role ?? "").trim();
    const company = String(body?.company ?? "").trim();
    const location = String(body?.location ?? "").trim() || null;
    const description = String(body?.description ?? "").trim() || null;
    const startDate = String(body?.startDate ?? "").trim() || null;
    const endDate = String(body?.endDate ?? "").trim() || null;
    const isCurrent = body?.isCurrent ? 1 : 0;
    const sortOrder = Number(body?.sortOrder ?? 0) || 0;

    if (!id || !role || !company) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      );
    }

    const db = getDb();
    await db.execute(
      "UPDATE experiences SET role = ?, company = ?, location = ?, start_date = ?, end_date = ?, is_current = ?, description = ?, sort_order = ? WHERE id = ?",
      [role, company, location, startDate, endDate, isCurrent, description, sortOrder, id]
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
    await db.execute("DELETE FROM experiences WHERE id = ?", [id]);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
