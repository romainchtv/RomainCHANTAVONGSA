import { headers } from "next/headers";
import AdminLogin from "./AdminLogin";
import AdminPanel from "./AdminPanel";
import { isAdminFromCookie } from "@/app/lib/admin-auth";

export default async function AdminPage() {
  const headerList = await headers();
  const isAdmin = isAdminFromCookie(headerList.get("cookie"));

  return (
    <div className="min-h-screen bg-[#0B0C0F] text-zinc-100">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-16">
        <h1 className="text-3xl font-semibold">Admin</h1>
        {isAdmin ? <AdminPanel /> : <AdminLogin />}
      </div>
    </div>
  );
}
