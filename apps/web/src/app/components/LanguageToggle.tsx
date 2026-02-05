"use client";

import Image from "next/image";
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
    <div className="flex items-center gap-2">
      <span className="inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-white px-3 py-1 text-xs uppercase tracking-[0.24em] text-zinc-900">
        <Image
          src={currentLang === "fr" ? "/flags/fr.svg" : "/flags/en.svg"}
          alt={currentLang === "fr" ? "France" : "United Kingdom"}
          width={22}
          height={16}
          priority
        />
        <span className="sr-only">{currentLang}</span>
      </span>
      <button
        type="button"
        onClick={onToggle}
        className="rounded-full border border-zinc-700 px-3 py-1 text-xs uppercase tracking-[0.24em] text-zinc-200 transition hover:border-zinc-500"
      >
        {label}
      </button>
    </div>
  );
}
