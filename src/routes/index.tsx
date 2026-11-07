import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MedScuta" },
      { name: "description", content: "Aprenda os sons da ausculta cardíaca e pulmonar." },
      { property: "og:title", content: "MedScuta" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:description", content: "Aprenda os sons da ausculta cardíaca e pulmonar." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 text-center">
      <img
        src="/estetoscopio-home.png"
        alt="Estetoscópio de fundo"
        className="pointer-events-none absolute h-[85vh] max-h-[800px] w-auto select-none object-contain opacity-15"
      />
      <h1 className="relative text-8xl md:text-9xl">medscuta</h1>
      <p className="relative mt-2 max-w-lg text-2xl">
        aprenda de uma vez por todas os sons da ausculta cardíaca e pulmonar!
      </p>
      <Link
        to="/escolha"
        className="relative mt-8 rounded-xl border-2 border-border px-16 py-3 text-5xl italic transition hover:bg-primary hover:text-primary-foreground"
      >
        Iniciar
      </Link>
      <p className="absolute bottom-6 flex items-center justify-center gap-2.5 font-blonde text-2xl font-normal lowercase tracking-[0.04em] text-foreground select-none">
        <span className="inline-block tracking-[0.04em]">made</span>
        <span className="inline-block tracking-[0.04em]">by</span>
        <span className="inline-block tracking-[0.04em]">cezar</span>
      </p>
    </main>
  );
}
