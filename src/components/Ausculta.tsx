import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

// Para adicionar sons: coloque os arquivos em public/sons/ com o nome indicado em "som".
export type Ponto = { id: string; nome: string; x: number; y: number; som: string };

export const pontosPulmonares: Ponto[] = [
  { id: "apice-d", nome: "Ápice direito", x: 38, y: 28, som: "/sons/pulmao-apice-direito.mp3" },
  { id: "apice-e", nome: "Ápice esquerdo", x: 62, y: 28, som: "/sons/pulmao-apice-esquerdo.mp3" },
  { id: "medio-d", nome: "Campo médio direito", x: 35, y: 39, som: "/sons/pulmao-medio-direito.mp3" },
  { id: "medio-e", nome: "Campo médio esquerdo", x: 65, y: 39, som: "/sons/pulmao-medio-esquerdo.mp3" },
  { id: "base-d", nome: "Base direita", x: 30, y: 52, som: "/sons/pulmao-base-direita.mp3" },
  { id: "base-e", nome: "Base esquerda", x: 70, y: 52, som: "/sons/pulmao-base-esquerda.mp3" },
];

export const pontosCardiacos: Ponto[] = [
  { id: "aortico", nome: "Foco aórtico", x: 44, y: 30, som: "/sons/coracao-aortico.mp3" },
  { id: "pulmonar", nome: "Foco pulmonar", x: 56, y: 30, som: "/sons/coracao-pulmonar.mp3" },
  { id: "acessorio", nome: "Foco aórtico acessório", x: 56, y: 36, som: "/sons/coracao-aortico-acessorio.mp3" },
  { id: "tricuspide", nome: "Foco tricúspide", x: 54, y: 46, som: "/sons/coracao-tricuspide.mp3" },
  { id: "mitral", nome: "Foco mitral", x: 63, y: 48, som: "/sons/coracao-mitral.mp3" },
];

export function Ausculta({ titulo, pontos }: { titulo: string; pontos: Ponto[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const audio = useRef<HTMLAudioElement | null>(null);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [msg, setMsg] = useState("Mova o estetoscópio sobre o tórax e clique para auscultar.");

  useEffect(() => () => audio.current?.pause(), []);

  const mover = (e: React.PointerEvent) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    if (!r.width || !r.height) return;
    const local = { x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 };
    setPos(local);
    return local;
  };

  const clicar = (e: React.PointerEvent) => {
    const local = mover(e);
    if (!local) return;
    const p = [...pontos].sort((a, b) => Math.hypot(a.x - local.x, (a.y - local.y) * 1.25) - Math.hypot(b.x - local.x, (b.y - local.y) * 1.25))[0];
    audio.current?.pause();
    if (!p || Math.hypot(p.x - local.x, (p.y - local.y) * 1.25) >= 6) return setMsg("Nenhum foco aqui. Tente outro ponto.");
    setMsg(`Auscultando: ${p.nome}`);
    const a = new Audio(p.som);
    audio.current = a;
    a.play().catch(() => setMsg(`${p.nome} — som ainda não adicionado (${p.som})`));
  };

  return (
    <main className="flex min-h-screen flex-col items-center px-4 py-8">
      <div className="flex w-full max-w-3xl items-center justify-between">
        <Link to="/escolha" className="text-lg italic hover:underline">← voltar</Link>
        <h1 className="text-4xl">{titulo}</h1>
        <span className="w-16" />
      </div>
      <p className="mt-4 min-h-7 text-center text-lg text-muted-foreground">{msg}</p>
      <div
        ref={ref}
        aria-label="Tórax para ausculta"
        onPointerDown={(e) => {
          if (e.button !== 0) return;
          e.currentTarget.setPointerCapture(e.pointerId);
          mover(e);
        }}
        onPointerMove={mover}
        onPointerLeave={(e) => { if (e.pointerType === "mouse") setPos(null); }}
        onPointerCancel={() => setPos(null)}
        onPointerUp={(e) => { if (e.button === 0) clicar(e); }}
        className="relative mt-4 aspect-[4/5] w-full max-w-md touch-none cursor-none select-none"
      >
        <svg viewBox="0 0 100 125" className="h-full w-full">
          <path d="M40 2 Q50 -2 60 2 Q64 10 60 20 L60 26 L40 26 L40 20 Q36 10 40 2 Z" className="fill-skin" />
          <path d="M40 22 Q30 26 14 30 Q6 34 6 46 L8 70 L14 72 L18 50 L18 118 Q50 124 82 118 L82 50 L86 72 L92 70 L94 46 Q94 34 86 30 Q70 26 60 22 Q50 30 40 22 Z" className="fill-skin" />
          <g className="stroke-skin-shade" strokeWidth="0.7" fill="none" strokeLinecap="round">
            <path d="M24 30 Q36 34 47 31 M53 31 Q64 34 76 30" />
            <path d="M50 32 L50 66" />
            <path d="M24 52 Q34 62 47 56 M53 56 Q66 62 76 52" />
            <path d="M30 70 Q40 72 47 70 M53 70 Q60 72 70 70" />
            <path d="M32 80 Q40 82 47 80 M53 80 Q60 82 68 80" />
            <path d="M50 66 L50 104" />
            <path d="M18 50 L18 40 M82 50 L82 40" />
          </g>
          <circle cx="37" cy="55" r="0.9" className="fill-skin-shade" />
          <circle cx="63" cy="55" r="0.9" className="fill-skin-shade" />
          <circle cx="50" cy="98" r="0.8" className="fill-skin-shade" />
        </svg>
        {pontos.map((p) => (
          <span key={p.id} title={p.nome} className="ausculta-point absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-foreground/30"
            style={{ left: `${p.x}%`, top: `${p.y}%` }} />
        ))}
        {pos && (
          <span className="pointer-events-none absolute h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-muted bg-secondary/80 shadow-lg"
            style={{ left: `${pos.x}%`, top: `${pos.y}%` }} />
        )}
      </div>
    </main>
  );
}
