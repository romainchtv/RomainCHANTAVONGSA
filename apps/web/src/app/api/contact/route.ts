import { NextResponse } from "next/server";
import { getDb } from "@/app/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = String(body?.name ?? "").trim();
    const email = String(body?.email ?? "").trim();
    const message = String(body?.message ?? "").trim();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      );
    }

    const db = getDb();
    await db.execute(
      "INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)",
      [name, email, message]
    );

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
