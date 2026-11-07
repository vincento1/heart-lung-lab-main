import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/escolha")({
  head: () => ({
    meta: [
      { title: "Escolha o modo — medscuta" },
      { name: "description", content: "Escolha ausculta pulmonar, cardíaca ou arcade." },
      { property: "og:title", content: "Escolha o modo — medscuta" },
      { property: "og:description", content: "Escolha ausculta pulmonar, cardíaca ou arcade." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Escolha,
});

const card =
  "flex w-64 flex-col items-center gap-4 rounded-2xl border-2 border-border bg-card p-8 transition hover:-translate-y-1 hover:bg-secondary";

function Escolha() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-10 px-4 py-10">
      <h1 className="text-6xl">escolha</h1>
      <div className="flex flex-wrap justify-center gap-6">
        <Link to="/pulmonar" className={card}>
          <svg viewBox="0 0 100 100" className="h-32 fill-foreground/90">
            <rect x="46" y="5" width="8" height="35" rx="3" />
            <path d="M44 38 Q30 30 22 45 Q10 70 14 90 Q30 96 44 85 Z" />
            <path d="M56 38 Q70 30 78 45 Q90 70 86 90 Q70 96 56 85 Z" />
          </svg>
          <span className="text-3xl italic">Pulmonar</span>
        </Link>
        <Link to="/cardiaca" className={card}>
          <svg viewBox="0 0 100 100" className="h-32 fill-foreground/90">
            <path d="M50 88 L14 50 Q2 30 20 18 Q38 8 50 30 Q62 8 80 18 Q98 30 86 50 Z" />
            <path
              d="M22 52 L38 52 L44 40 L52 66 L58 52 L78 52"
              className="fill-none stroke-background"
              strokeWidth="4"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-3xl italic">Cardíaca</span>
        </Link>
        <Link to="/arcade" className={card}>
          <svg viewBox="0 0 100 100" className="h-32 fill-foreground/90">
            <path d="M50 18 A32 32 0 0 0 18 50 L18 72 A10 10 0 0 0 28 82 L34 82 A6 6 0 0 0 40 76 L40 56 A6 6 0 0 0 34 50 L26 50 A24 24 0 0 1 74 50 L66 50 A6 6 0 0 0 60 56 L60 76 A6 6 0 0 0 66 82 L72 82 A10 10 0 0 0 82 72 L82 50 A32 32 0 0 0 50 18 Z" />
          </svg>
          <span className="text-3xl italic">Sons</span>
        </Link>
      </div>
      <Link to="/" className="text-lg italic hover:underline">
        ← voltar
      </Link>
    </main>
  );
}
