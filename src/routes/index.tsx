import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "medscuta — treine ausculta" },
      { name: "description", content: "Aprenda os sons da ausculta cardíaca e pulmonar." },
      { property: "og:title", content: "medscuta" },
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
      <svg viewBox="0 0 100 120" className="pointer-events-none absolute h-[85vh] stroke-foreground/15" fill="none" strokeWidth="6" strokeLinecap="round">
        <path d="M25 8 Q8 15 10 40 Q14 65 40 68 Q66 65 70 40 Q72 15 55 8" />
        <path d="M40 68 L40 95 Q42 115 62 112 Q80 108 78 85 L78 75" />
        <circle cx="78" cy="65" r="9" />
      </svg>
      <h1 className="relative text-8xl md:text-9xl">medscuta</h1>
      <p className="relative mt-2 max-w-lg text-2xl">aprenda de uma vez por todas os sons da ausculta cardíaca e pulmonar!</p>
      <Link to="/escolha" className="relative mt-8 rounded-xl border-2 border-border px-16 py-3 text-5xl italic transition hover:bg-primary hover:text-primary-foreground">Iniciar</Link>
      <p className="absolute bottom-6 font-brand text-3xl italic">made by cezar</p>
    </main>
  );
}
