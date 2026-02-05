"use client";

import { useRef, useState } from "react";

type FormState = "idle" | "loading" | "success" | "error";

type ContactFormCopy = {
  nameLabel: string;
  emailLabel: string;
  messageLabel: string;
  submitLabel: string;
  sendingLabel: string;
  successLabel: string;
  errorDefault: string;
};

type ContactFormProps = {
  copy: ContactFormCopy;
};

export default function ContactForm({ copy }: ContactFormProps) {
  const [state, setState] = useState<FormState>("idle");
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("loading");
    setError(null);

    const form = event.currentTarget ?? formRef.current;
    if (!form) {
      setState("error");
      setError("Formulaire introuvable.");
      return;
    }

    const formData = new FormData(form);
    const payload = {
      name: String(formData.get("name") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      message: String(formData.get("message") ?? "").trim()
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        const message =
          typeof data?.error === "string" ? data.error : copy.errorDefault;
        throw new Error(message);
      }

      form.reset();
      setState("success");
    } catch (err) {
      setState("error");
      setError(
        err instanceof Error
          ? err.message
          : copy.errorDefault
      );
    }
  }

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      className="mt-6 grid gap-4 sm:grid-cols-2"
    >
      <label className="grid gap-2 text-sm text-zinc-300">
        {copy.nameLabel}
        <input
          suppressHydrationWarning
          name="name"
          required
          className="rounded-lg border border-zinc-800 bg-zinc-950/50 px-3 py-2 text-sm text-white"
        />
      </label>
      <label className="grid gap-2 text-sm text-zinc-300">
        {copy.emailLabel}
        <input
          suppressHydrationWarning
          type="email"
          name="email"
          required
          className="rounded-lg border border-zinc-800 bg-zinc-950/50 px-3 py-2 text-sm text-white"
        />
      </label>
      <label className="grid gap-2 text-sm text-zinc-300 sm:col-span-2">
        {copy.messageLabel}
        <textarea
          suppressHydrationWarning
          name="message"
          required
          rows={5}
          className="rounded-lg border border-zinc-800 bg-zinc-950/50 px-3 py-2 text-sm text-white"
        />
      </label>
      <div className="sm:col-span-2 flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={state === "loading"}
          className="rounded-full bg-white px-5 py-2 text-sm font-medium text-zinc-900 transition hover:bg-zinc-200 disabled:opacity-70"
        >
          {state === "loading" ? copy.sendingLabel : copy.submitLabel}
        </button>
        {state === "success" && (
          <span className="text-sm text-emerald-300">
            {copy.successLabel}
          </span>
        )}
        {state === "error" && (
          <span className="text-sm text-red-300">
            {error ?? "Erreur."}
          </span>
        )}
      </div>
    </form>
  );
}
