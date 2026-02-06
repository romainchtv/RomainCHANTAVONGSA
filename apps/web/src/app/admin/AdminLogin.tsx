"use client";

import { useState } from "react";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? "Connexion impossible");
      }

      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Connexion impossible");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="flex max-w-md flex-col gap-4 rounded-2xl border border-zinc-800 bg-zinc-950/40 p-6"
    >
      <div>
        <label className="text-sm text-zinc-300">Utilisateur</label>
        <input
          className="mt-2 w-full rounded-lg border border-zinc-800 bg-black/40 px-3 py-2 text-sm text-white"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          required
        />
      </div>
      <div>
        <label className="text-sm text-zinc-300">Mot de passe</label>
        <input
          type="password"
          className="mt-2 w-full rounded-lg border border-zinc-800 bg-black/40 px-3 py-2 text-sm text-white"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="rounded-full bg-white px-5 py-2 text-sm font-medium text-zinc-900 disabled:opacity-70"
      >
        {loading ? "Connexion..." : "Se connecter"}
      </button>
      {error ? <p className="text-sm text-red-300">{error}</p> : null}
    </form>
  );
}
