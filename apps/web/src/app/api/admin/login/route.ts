import { NextResponse } from "next/server";
import {
  getAdminCookie,
  verifyAdminCredentials
} from "@/app/lib/admin-auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const username = String(body?.username ?? "").trim();
    const password = String(body?.password ?? "").trim();

    if (!verifyAdminCredentials(username, password)) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { ok: true },
      {
        headers: {
          "Set-Cookie": getAdminCookie()
        }
      }
    );
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
