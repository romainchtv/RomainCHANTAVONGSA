import ContactForm from "./components/ContactForm";
import LanguageToggle from "./components/LanguageToggle";
import { headers } from "next/headers";

type Lang = "fr" | "en";

type Copy = {
  title: string;
  name: string;
  projectTitle: string;
  projectPlaceholder: string;
  aboutTitle: string;
  aboutBody: string;
  experienceTitle: string;
  experiences: { role: string; place: string; period: string }[];
  contactTitle: string;
  contactSubtitle: string;
  switchLabel: string;
  switchTo: Lang;
  form: {
    nameLabel: string;
    emailLabel: string;
    messageLabel: string;
    submitLabel: string;
    sendingLabel: string;
    successLabel: string;
    errorDefault: string;
  };
};

const copy: Record<Lang, Copy> = {
  fr: {
    title: "Portfolio",
    name: "Romain Chantavongsa",
    projectTitle: "Mon projet",
    projectPlaceholder: "A completer.",
    aboutTitle: "A propos de moi",
    aboutBody: "A completer.",
    experienceTitle: "Experiences",
    experiences: [],
    contactTitle: "Contact",
    contactSubtitle: "Laisse ton message, je reviens vers toi rapidement.",
    switchLabel: "EN",
    switchTo: "en",
    form: {
      nameLabel: "Nom",
      emailLabel: "Email",
      messageLabel: "Message",
      submitLabel: "Envoyer",
      sendingLabel: "Envoi...",
      successLabel: "Message envoye. Merci.",
      errorDefault: "Impossible d'envoyer le message pour l'instant."
    }
  },
  en: {
    title: "Portfolio",
    name: "Romain Chantavongsa",
    projectTitle: "My project",
    projectPlaceholder: "To be completed.",
    aboutTitle: "About me",
    aboutBody: "To be completed.",
    experienceTitle: "Experience",
    experiences: [],
    contactTitle: "Contact",
    contactSubtitle: "Leave a message and I will get back to you soon.",
    switchLabel: "FR",
    switchTo: "fr",
    form: {
      nameLabel: "Name",
      emailLabel: "Email",
      messageLabel: "Message",
      submitLabel: "Send",
      sendingLabel: "Sending...",
      successLabel: "Message sent. Thank you.",
      errorDefault: "Unable to send the message right now."
    }
  }
};

function pickLang(
  searchParams?: { lang?: string },
  headerList?: { get(name: string): string | null }
) {
  if (searchParams?.lang === "en" || searchParams?.lang === "fr") {
    return searchParams.lang;
  }

  const cookieLang = headerList
    ?.get("cookie")
    ?.match(/(?:^|;\\s*)lang=([^;]+)/)?.[1];
  if (cookieLang === "en" || cookieLang === "fr") {
    return cookieLang;
  }

  const acceptLang = headerList?.get("accept-language") ?? "";
  return acceptLang.toLowerCase().startsWith("fr") ? "fr" : "en";
}

export default async function Home(props: {
  searchParams?: Promise<{ lang?: string }>;
}) {
  const searchParams = await props.searchParams;
  const headerList = await headers();
  const lang: Lang = pickLang(searchParams, headerList);
  const t = copy[lang];

  return (
    <div className="relative min-h-screen bg-[#0B0C0F] text-zinc-100">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 top-24 h-72 w-72 rounded-full bg-[#1D2A4A] blur-3xl opacity-70" />
        <div className="absolute right-0 top-64 h-96 w-96 rounded-full bg-[#402113] blur-3xl opacity-70" />
      </div>
      <main className="relative mx-auto flex max-w-5xl flex-col gap-12 px-6 py-16 sm:py-20">
        <header className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-[0.32em] text-zinc-400">
              {t.title}
            </p>
            <LanguageToggle
              currentLang={lang}
              nextLang={t.switchTo}
              label={t.switchLabel}
            />
          </div>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            {t.name}
          </h1>
        </header>

        <section id="projects" className="rounded-2xl border border-zinc-800 p-6">
          <h2 className="text-lg font-semibold">{t.projectTitle}</h2>
          <p className="mt-2 text-sm text-zinc-400">
            {t.projectPlaceholder}
          </p>
        </section>

        <section id="about" className="rounded-2xl border border-zinc-800 p-6">
          <h2 className="text-lg font-semibold">{t.aboutTitle}</h2>
          <p className="mt-2 text-sm text-zinc-400">
            {t.aboutBody}
          </p>
        </section>

        <section id="experience" className="rounded-2xl border border-zinc-800 p-6">
          <h2 className="text-lg font-semibold">{t.experienceTitle}</h2>
          {t.experiences.length === 0 ? (
            <p className="mt-2 text-sm text-zinc-400">
              {lang === "fr" ? "A completer." : "To be completed."}
            </p>
          ) : (
            <div className="mt-4 grid gap-3">
              {t.experiences.map((item) => (
                <div
                  key={`${item.role}-${item.place}`}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-zinc-800 bg-zinc-950/30 px-4 py-3 text-sm"
                >
                  <div className="flex flex-col">
                    <span className="font-medium text-zinc-100">
                      {item.role}
                    </span>
                    <span className="text-zinc-400">{item.place}</span>
                  </div>
                  <span className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                    {item.period}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        <section id="contact" className="rounded-2xl border border-zinc-800 p-6">
          <h2 className="text-lg font-semibold">{t.contactTitle}</h2>
          <p className="mt-2 text-sm text-zinc-400">
            {t.contactSubtitle}
          </p>
          <ContactForm copy={t.form} />
        </section>
      </main>
    </div>
  );
}
