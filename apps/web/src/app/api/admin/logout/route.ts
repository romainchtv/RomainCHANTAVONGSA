import { NextResponse } from "next/server";
import { clearAdminCookie } from "@/app/lib/admin-auth";

export async function POST() {
  return NextResponse.json(
    { ok: true },
    {
      headers: {
        "Set-Cookie": clearAdminCookie()
      }
    }
  );
}
