"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type LanguageToggleProps = {
  currentLang: "fr" | "en";
  nextLang: "fr" | "en";
  label: string;
};

function setLangCookie(lang: "fr" | "en") {
  document.cookie = `lang=${lang}; Path=/; Max-Age=31536000; SameSite=Lax`;
}

export default function LanguageToggle({
  currentLang,
  nextLang,
  label
}: LanguageToggleProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const hasCookie = document.cookie.split(";").some((c) => c.trim().startsWith("lang="));
    if (!hasCookie) {
      setLangCookie(currentLang);
    }
  }, [currentLang]);

  function onToggle() {
    setLangCookie(nextLang);
    const params = new URLSearchParams(searchParams?.toString());
    params.set("lang", nextLang);
    router.push(`/?${params.toString()}`);
  }

  return (
    <button
      type="button"
      onClick={onToggle}
      className="rounded-full border border-zinc-700 px-3 py-1 text-xs uppercase tracking-[0.3em] text-zinc-200 transition hover:border-zinc-500"
    >
      {label}
    </button>
  );
}
