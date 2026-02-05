export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#0B0C0F] text-zinc-100">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 top-24 h-72 w-72 rounded-full bg-[#1D2A4A] blur-3xl opacity-70" />
        <div className="absolute right-0 top-64 h-96 w-96 rounded-full bg-[#402113] blur-3xl opacity-70" />
      </div>
      <main className="relative mx-auto flex max-w-5xl flex-col gap-12 px-6 py-16 sm:py-20">
        <header className="flex flex-col gap-4">
          <p className="text-xs uppercase tracking-[0.32em] text-zinc-400">
            Portfolio
          </p>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            Romain Chantavongsa
          </h1>
        </header>

        <section id="projects" className="rounded-2xl border border-zinc-800 p-6">
          <h2 className="text-lg font-semibold">Mon projet</h2>
          <p className="mt-2 text-sm text-zinc-400">
            À compléter.
          </p>
        </section>
      </main>
    </div>
  );
}
