import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { pontosPulmonares, type Ponto } from "@/components/Ausculta";

export const sonsCardiacosArcade: Ponto[] = [
  {
    id: "cardio-normal",
    nome: "Bulhas normais (B1 e B2)",
    x: 0,
    y: 0,
    som: "/sonscardio/cardio/bulhasnormais.mp3",
    correto: "Bulhas normais (B1 e B2)",
  },
  {
    id: "cardio-desdobra-b2",
    nome: "Desdobramento de B2",
    x: 0,
    y: 0,
    som: "/sonscardio/cardio/desdobramento-b2.mp3",
    correto: "Desdobramento de B2",
  },
  {
    id: "cardio-b3",
    nome: "Terceira bulha (B3)",
    x: 0,
    y: 0,
    som: "/sonscardio/cardio/b3.mp3",
    correto: "Terceira bulha (B3)",
  },
  {
    id: "cardio-b4",
    nome: "Quarta bulha (B4)",
    x: 0,
    y: 0,
    som: "/sonscardio/cardio/b4.mp3",
    correto: "Quarta bulha (B4)",
  },
  {
    id: "cardio-ejetivo",
    nome: "Sopro ejetivo (Estenose aórtica)",
    x: 0,
    y: 0,
    som: "/sonscardio/cardio/ejetivo.mp3",
    correto: "Sopro ejetivo",
  },
  {
    id: "cardio-aspirativo",
    nome: "Sopro aspirativo (Insuficiência aórtica)",
    x: 0,
    y: 0,
    som: "/sonscardio/cardio/aspirativo.mp3",
    correto: "Sopro aspirativo",
  },
  {
    id: "cardio-regurgitante",
    nome: "Sopro regurgitante (Insuficiência mitral)",
    x: 0,
    y: 0,
    som: "/sonscardio/cardio/regurgitante.mp3",
    correto: "Sopro regurgitante",
  },
  {
    id: "cardio-ruflar",
    nome: "Sopro em ruflar (Estenose mitral)",
    x: 0,
    y: 0,
    som: "/sonscardio/cardio/em-ruflar.mp3",
    correto: "Sopro em ruflar",
  },
];

export const Route = createFileRoute("/arcade")({
  head: () => ({
    meta: [
      { title: "Sons — medscuta" },
      {
        name: "description",
        content: "Escolha e ouça qualquer som de ausculta cardíaca e pulmonar.",
      },
      { property: "og:title", content: "Sons — medscuta" },
      {
        property: "og:description",
        content: "Escolha e ouça qualquer som de ausculta cardíaca e pulmonar.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SonsPage,
});

function SonsPage() {
  const audio = useRef<HTMLAudioElement | null>(null);
  const [msg, setMsg] = useState("Escolha um som para ouvir.");
  const [somAtivoId, setSomAtivoId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    return () => {
      audio.current?.pause();
      audio.current = null;
    };
  }, []);

  const tocar = (p: Ponto) => {
    if (somAtivoId === p.id && isPlaying) {
      audio.current?.pause();
      setIsPlaying(false);
      setMsg(`Pausado: ${p.correto || p.nome}`);
      return;
    }

    audio.current?.pause();
    const a = new Audio(p.som);
    a.loop = true;
    audio.current = a;
    setSomAtivoId(p.id);
    setIsPlaying(true);
    setMsg(`Tocando: ${p.correto || p.nome}`);
    const res = a.play();
    if (res && typeof res.catch === "function") {
      res.catch(() => {
        setIsPlaying(false);
        setMsg(`${p.nome} — som ainda não adicionado (${p.som})`);
      });
    }
  };

  const parar = () => {
    audio.current?.pause();
    setIsPlaying(false);
    setSomAtivoId(null);
    setMsg("Áudio interrompido. Escolha um som para ouvir.");
  };

  const grupos = [
    ["Cardíaca", sonsCardiacosArcade],
    ["Pulmonar", pontosPulmonares],
  ] as const;

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-6 px-4 py-8">
      <div className="flex items-center justify-between">
        <Link to="/escolha" className="text-lg italic hover:underline">
          ← voltar
        </Link>
        <h1 className="text-5xl italic">sons</h1>
        <span className="w-16" />
      </div>

      <div className="flex flex-col items-center gap-2">
        <p className="text-center text-lg text-muted-foreground">{msg}</p>
        {isPlaying && (
          <button
            onClick={parar}
            className="flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2 text-sm text-foreground transition hover:bg-secondary active:scale-95"
          >
            ⏹ Parar reprodução
          </button>
        )}
      </div>

      {grupos.map(([nome, lista]) => (
        <section key={nome}>
          <h2 className="mb-3 text-2xl italic">{nome}</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
            {lista.map((p) => {
              const ativo = somAtivoId === p.id && isPlaying;
              return (
                <button
                  key={p.id}
                  onClick={() => tocar(p)}
                  className={`rounded-2xl border-2 p-4 text-left transition ${
                    ativo
                      ? "border-accent bg-accent/25 text-foreground ring-2 ring-accent"
                      : "border-border bg-card hover:bg-secondary"
                  }`}
                >
                  <div className="text-base font-semibold">
                    {ativo ? "⏸" : "▶"} {p.correto || p.nome}
                  </div>
                  {p.correto && p.nome !== p.correto && (
                    <div className="text-xs text-muted-foreground mt-1">{p.nome}</div>
                  )}
                </button>
              );
            })}
          </div>
        </section>
      ))}
    </main>
  );
}
