import ContactForm from "./components/ContactForm";
import LanguageToggle from "./components/LanguageToggle";
import { headers } from "next/headers";
import {
  fetchAbout,
  fetchEducation,
  fetchExperiences,
  fetchProjects,
  fetchSkills
} from "@/app/lib/content";

type Lang = "fr" | "en";

type Copy = {
  title: string;
  name: string;
  projectTitle: string;
  projectPlaceholder: string;
  aboutTitle: string;
  aboutBody: string;
  experienceTitle: string;
  skillsTitle: string;
  educationTitle: string;
  emptyLabel: string;
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
    projectTitle: "Mes projets",
    projectPlaceholder: "A completer.",
    aboutTitle: "A propos de moi",
    aboutBody: "A completer.",
    experienceTitle: "Experiences",
    skillsTitle: "Competences",
    educationTitle: "Formation",
    emptyLabel: "A completer.",
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
    projectTitle: "Projects",
    projectPlaceholder: "To be completed.",
    aboutTitle: "About me",
    aboutBody: "To be completed.",
    experienceTitle: "Experience",
    skillsTitle: "Skills",
    educationTitle: "Education",
    emptyLabel: "To be completed.",
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
    ?.match(/(?:^|;\s*)lang=([^;]+)/)?.[1];
  if (cookieLang === "en" || cookieLang === "fr") {
    return cookieLang;
  }

  const acceptLang = headerList?.get("accept-language") ?? "";
  return acceptLang.toLowerCase().startsWith("fr") ? "fr" : "en";
}

function formatDate(value: unknown) {
  if (!value) return "";
  const date =
    value instanceof Date ? value : new Date(String(value));
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toISOString().slice(0, 7);
}

export default async function Home(props: {
  searchParams?: Promise<{ lang?: string }>;
}) {
  const searchParams = await props.searchParams;
  const headerList = await headers();
  const lang: Lang = pickLang(searchParams, headerList);
  const t = copy[lang];
  const currentLabel = lang === "fr" ? "Aujourd hui" : "Present";

  const [about, experiences, projects, skills, education] = await Promise.all([
    fetchAbout(lang),
    fetchExperiences(lang),
    fetchProjects(lang),
    fetchSkills(lang),
    fetchEducation(lang)
  ]);

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
          {projects.length === 0 ? (
            <p className="mt-2 text-sm text-zinc-400">
              {t.projectPlaceholder}
            </p>
          ) : (
            <div className="mt-4 grid gap-3">
              {projects.map((project) => (
                <article
                  key={project.id}
                  className="rounded-xl border border-zinc-800 bg-zinc-950/30 p-4"
                >
                  {project.image_url ? (
                    <a
                      href={project.image_url}
                      target="_blank"
                      rel="noreferrer"
                      className="group relative mb-3 block overflow-hidden rounded-lg border border-zinc-800"
                    >
                      <img
                        src={project.image_url}
                        alt={project.title}
                        className="h-40 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                      <span className="absolute right-3 top-3 rounded-full bg-black/70 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-white">
                        Zoom
                      </span>
                    </a>
                  ) : null}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-base font-semibold">
                      {project.title}
                    </h3>
                    {project.url ? (
                      <a
                        className="text-xs uppercase tracking-[0.2em] text-zinc-400 hover:text-zinc-200"
                        href={project.url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Link
                      </a>
                    ) : null}
                  </div>
                  {project.subtitle ? (
                    <p className="mt-1 text-sm text-zinc-400">
                      {project.subtitle}
                    </p>
                  ) : null}
                  {project.description ? (
                    <p className="mt-2 text-sm text-zinc-300">
                      {project.description}
                    </p>
                  ) : null}
                  {project.stack ? (
                    <p className="mt-2 text-xs uppercase tracking-[0.2em] text-zinc-500">
                      {project.stack}
                    </p>
                  ) : null}
                </article>
              ))}
            </div>
          )}
        </section>

        <section id="about" className="rounded-2xl border border-zinc-800 p-6">
          <h2 className="text-lg font-semibold">{t.aboutTitle}</h2>
          <p className="mt-2 text-sm text-zinc-400">
            {about ?? t.aboutBody}
          </p>
        </section>

        <section id="experience" className="rounded-2xl border border-zinc-800 p-6">
          <h2 className="text-lg font-semibold">{t.experienceTitle}</h2>
          {experiences.length === 0 ? (
            <p className="mt-2 text-sm text-zinc-400">{t.emptyLabel}</p>
          ) : (
            <div className="mt-4 grid gap-3">
              {experiences.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-zinc-800 bg-zinc-950/30 px-4 py-3 text-sm"
                >
                  <div className="flex flex-col">
                    <span className="font-medium text-zinc-100">
                      {item.role}
                    </span>
                    <span className="text-zinc-400">{item.company}</span>
                    {item.location ? (
                      <span className="text-zinc-500">{item.location}</span>
                    ) : null}
                  </div>
                  <span className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                    {formatDate(item.start_date)}
                    {item.start_date || item.end_date ? " - " : ""}
                    {item.is_current ? currentLabel : formatDate(item.end_date)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        <section id="skills" className="rounded-2xl border border-zinc-800 p-6">
          <h2 className="text-lg font-semibold">{t.skillsTitle}</h2>
          {skills.length === 0 ? (
            <p className="mt-2 text-sm text-zinc-400">{t.emptyLabel}</p>
          ) : (
            <div className="mt-4 flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill.id}
                  className="rounded-full border border-zinc-800 bg-zinc-950/30 px-3 py-1 text-xs text-zinc-200"
                >
                  {skill.name}
                  {skill.level ? ` · ${skill.level}` : ""}
                </span>
              ))}
            </div>
          )}
        </section>

        <section id="education" className="rounded-2xl border border-zinc-800 p-6">
          <h2 className="text-lg font-semibold">{t.educationTitle}</h2>
          {education.length === 0 ? (
            <p className="mt-2 text-sm text-zinc-400">{t.emptyLabel}</p>
          ) : (
            <div className="mt-4 grid gap-3">
              {education.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-zinc-800 bg-zinc-950/30 px-4 py-3 text-sm"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-col">
                      <span className="font-medium text-zinc-100">
                        {item.school}
                      </span>
                      <span className="text-zinc-400">
                        {item.degree ?? ""} {item.field ?? ""}
                      </span>
                    </div>
                    <span className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                      {formatDate(item.start_date)}
                      {item.start_date || item.end_date ? " - " : ""}
                      {formatDate(item.end_date)}
                    </span>
                  </div>
                  {item.description ? (
                    <p className="mt-2 text-zinc-400">{item.description}</p>
                  ) : null}
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
