import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { pontosCardiacos, pontosPulmonares, type Ponto } from "@/components/Ausculta";

// Sons extras do arcade: adicione itens aqui e os arquivos em public/sons/
const extras: Ponto[] = [
  { id: "sibilo", nome: "Sibilos", x: 0, y: 0, som: "/sons/arcade-sibilos.mp3" },
  { id: "crepitacao", nome: "Crepitações", x: 0, y: 0, som: "/sons/arcade-crepitacoes.mp3" },
  { id: "sopro", nome: "Sopro sistólico", x: 0, y: 0, som: "/sons/arcade-sopro-sistolico.mp3" },
  { id: "b3", nome: "Terceira bulha (B3)", x: 0, y: 0, som: "/sons/arcade-b3.mp3" },
];

export const Route = createFileRoute("/arcade")({
  head: () => ({ meta: [{ title: "Arcade — medscuta" }, { name: "description", content: "Escolha e ouça qualquer som de ausculta." }, { property: "og:title", content: "Arcade — medscuta" }, { property: "og:description", content: "Escolha e ouça qualquer som de ausculta." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: Arcade,
});

function Arcade() {
  const audio = useRef<HTMLAudioElement | null>(null);
  const [msg, setMsg] = useState("Escolha um som para ouvir.");
  const tocar = (p: Ponto) => {
    audio.current?.pause();
    const a = new Audio(p.som);
    audio.current = a;
    setMsg(`Tocando: ${p.nome}`);
    a.play().catch(() => setMsg(`${p.nome} — som ainda não adicionado (${p.som})`));
  };
  const grupos = [["Pulmonar", pontosPulmonares], ["Cardíaca", pontosCardiacos], ["Extras", extras]] as const;
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-6 px-4 py-8">
      <div className="flex items-center justify-between">
        <Link to="/escolha" className="text-lg italic hover:underline">← voltar</Link>
        <h1 className="text-5xl">arcade</h1>
        <span className="w-16" />
      </div>
      <p className="text-center text-lg text-muted-foreground">{msg}</p>
      {grupos.map(([nome, lista]) => (
        <section key={nome}>
          <h2 className="mb-3 text-2xl italic">{nome}</h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {lista.map((p) => (
              <button key={p.id} onClick={() => tocar(p)} className="rounded-xl border-2 border-border bg-card px-4 py-3 text-left transition hover:bg-secondary">
                ▶ {p.nome}
              </button>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
