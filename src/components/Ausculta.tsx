import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  X,
  Stethoscope,
  Volume2,
  Sparkles,
} from "lucide-react";

export type Ponto = {
  id: string;
  nome: string;
  x: number;
  y: number;
  som: string;
  correto?: string;
  opcoes?: string[];
  descricao?: string;
};

// Definições dos 7 sons pulmonares adicionados na pasta src/sons
const sonsPulmonaresBase = [
  {
    id: "estridor",
    som: "/sons/estridorgol.mp3",
    correto: "Estridor",
    opcoes: ["Estridor", "Sibilos", "Roncos", "Murmúrio vesicular (Normal)"],
    descricao:
      "Som agudo e áspero contínuo de alta frequência, mais intenso na inspiração, decorrente de obstrução parcial de vias aéreas superiores (laringe ou traqueia).",
  },
  {
    id: "murmurio",
    som: "/sons/normalmurmurio.mp3",
    correto: "Murmúrio vesicular (Normal)",
    opcoes: ["Murmúrio vesicular (Normal)", "Sibilos", "Crepitações finas", "Atrito pleural"],
    descricao:
      "Som respiratório fisiológico e normal, suave e contínuo, produzido pela passagem do ar nos alvéolos sadios.",
  },
  {
    id: "sibilos",
    som: "/sons/sibilogol.mp3",
    correto: "Sibilos",
    opcoes: ["Sibilos", "Roncos", "Estridor", "Crepitações grossas"],
    descricao:
      "Sons contínuos e musicais de tom agudo (chiado), decorrentes de broncoespasmo ou estreitamento de vias aéreas distais (asma, DPOC).",
  },
  {
    id: "roncos",
    som: "/sons/roncogol.mp3",
    correto: "Roncos",
    opcoes: ["Roncos", "Sibilos", "Atrito pleural", "Crepitações finas"],
    descricao:
      "Sons contínuos e graves decorrentes da vibração de secreções espessas nas grandes vias brônquicas.",
  },
  {
    id: "crep-finas",
    som: "/sons/crepitorfino.mp3",
    correto: "Crepitações finas",
    opcoes: ["Crepitações finas", "Crepitações grossas", "Roncos", "Murmúrio vesicular (Normal)"],
    descricao:
      "Sons descontínuos, curtos e secos (semelhantes ao esfregar de cabelos), gerados pela abertura súbita de alvéolos colabados no final da inspiração.",
  },
  {
    id: "crep-grossas",
    som: "/sons/crepgrossa.mp3",
    correto: "Crepitações grossas",
    opcoes: ["Crepitações grossas", "Crepitações finas", "Sibilos", "Estridor"],
    descricao:
      "Sons descontínuos e mais graves com aspecto 'bolhoso', provocados por acúmulo de secreção fluida nos brônquios.",
  },
  {
    id: "atrito-pleural",
    som: "/sons/atritogol.mp3",
    correto: "Atrito pleural",
    opcoes: ["Atrito pleural", "Crepitações finas", "Roncos", "Estridor"],
    descricao:
      "Som áspero e superficial que lembra o atrito de duas peças de couro seco, produzido pelo roçar dos folhetos pleurais inflamados.",
  },
];

// Posições anatômicas pulmonares para sorteio aleatório
const regioesAnatomicasTorax = [
  { x: 50, y: 16, regiao: "Traqueia / Região cervical" },
  { x: 36, y: 28, regiao: "Ápice pulmonar direito" },
  { x: 64, y: 28, regiao: "Ápice pulmonar esquerdo" },
  { x: 33, y: 38, regiao: "Campo pulmonar médio direito" },
  { x: 67, y: 38, regiao: "Campo pulmonar médio esquerdo" },
  { x: 31, y: 52, regiao: "Base pulmonar anterior direita" },
  { x: 69, y: 52, regiao: "Base pulmonar anterior esquerda" },
  { x: 26, y: 66, regiao: "Região lateral axilar direita" },
  { x: 74, y: 66, regiao: "Região lateral axilar esquerda" },
  { x: 44, y: 44, regiao: "Região paraxifoide direita" },
  { x: 56, y: 44, regiao: "Região paraxifoide esquerda" },
];

export function gerarPontosPulmonaresAleatorios(): Ponto[] {
  // Embaralha as regiões anatômicas do tórax
  const regioesEmbaralhadas = [...regioesAnatomicasTorax].sort(() => Math.random() - 0.5);

  return sonsPulmonaresBase.map((item, idx) => {
    const reg = regioesEmbaralhadas[idx];
    const jitterX = (Math.random() - 0.5) * 2;
    const jitterY = (Math.random() - 0.5) * 2;
    return {
      ...item,
      x: Math.round((reg.x + jitterX) * 10) / 10,
      y: Math.round((reg.y + jitterY) * 10) / 10,
      nome: reg.regiao,
    };
  });
}

// Exportação padrão para compatibilidade de rotas e testes
export const pontosPulmonares: Ponto[] = sonsPulmonaresBase.map((item, idx) => ({
  ...item,
  x: regioesAnatomicasTorax[idx].x,
  y: regioesAnatomicasTorax[idx].y,
  nome: regioesAnatomicasTorax[idx].regiao,
}));

export const pontosCardiacos: Ponto[] = [
  { id: "aortico", nome: "Foco aórtico", x: 44, y: 30, som: "/sons/coracao-aortico.mp3" },
  { id: "pulmonar", nome: "Foco pulmonar", x: 56, y: 30, som: "/sons/coracao-pulmonar.mp3" },
  {
    id: "acessorio",
    nome: "Foco aórtico acessório",
    x: 56,
    y: 36,
    som: "/sons/coracao-aortico-acessorio.mp3",
  },
  { id: "tricuspide", nome: "Foco tricúspide", x: 52, y: 48, som: "/sons/coracao-tricuspide.mp3" },
  { id: "mitral", nome: "Foco mitral", x: 67, y: 53, som: "/sons/coracao-mitral.mp3" },
];

function tocarBeepContagem(final = false) {
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (final) {
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.1); // A5
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } else {
      osc.type = "sine";
      osc.frequency.setValueAtTime(440, ctx.currentTime); // A4
      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    }
  } catch {
    // Autoplay fallback
  }
}

export function Ausculta({ titulo, pontos }: { titulo: string; pontos: Ponto[] }) {
  const isPulmonar = titulo.toLowerCase().includes("pulmonar");

  // Pontos com posições aleatórias para o modo pulmonar a cada sessão
  const [pontosAtivos, setPontosAtivos] = useState<Ponto[]>(() =>
    isPulmonar ? gerarPontosPulmonaresAleatorios() : pontos,
  );

  const ref = useRef<HTMLDivElement>(null);
  const audio = useRef<HTMLAudioElement | null>(null);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);

  // Estados dos Popups
  const [modalIntro, setModalIntro] = useState(isPulmonar);
  const [popupEncontrado, setPopupEncontrado] = useState<Ponto | null>(null);
  const [pontoAtivo, setPontoAtivo] = useState<Ponto | null>(null);

  // Contagem regressiva e latência de proteção inicial
  const [contagem, setContagem] = useState<number | null>(null);
  const bloqueioDetecaoAte = useRef<number>(Date.now() + (isPulmonar ? 3500 : 0));

  const [isPlaying, setIsPlaying] = useState(false);
  const [opcaoSelecionada, setOpcaoSelecionada] = useState<string | null>(null);
  const [statusFeedback, setStatusFeedback] = useState<"correto" | "errado" | null>(null);
  const [acertos, setAcertos] = useState<Record<string, boolean>>({});
  const [msg, setMsg] = useState("Mova o estetoscópio sobre o tórax para encontrar os sons.");

  // Dispara a contagem regressiva de 3 segundos com beeps
  const iniciarContagem = () => {
    bloqueioDetecaoAte.current = Date.now() + 3600;
    setContagem(3);
    tocarBeepContagem(false);

    const t1 = setTimeout(() => {
      setContagem(2);
      tocarBeepContagem(false);
    }, 1000);

    const t2 = setTimeout(() => {
      setContagem(1);
      tocarBeepContagem(false);
    }, 2000);

    const t3 = setTimeout(() => {
      setContagem(0); // "valendo!"
      tocarBeepContagem(true);
    }, 3000);

    const t4 = setTimeout(() => {
      setContagem(null);
      bloqueioDetecaoAte.current = Date.now() + 300;
    }, 3600);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  };

  const fecharIntroEIniciar = () => {
    setModalIntro(false);
    iniciarContagem();
  };

  useEffect(() => {
    // A contagem inicia quando o modal de introdução for confirmado
  }, [isPulmonar]);

  // Pausa o som quando desmontar o componente
  useEffect(() => {
    return () => {
      audio.current?.pause();
      audio.current = null;
    };
  }, []);

  const darCooldown = (ms = 1200) => {
    bloqueioDetecaoAte.current = Date.now() + ms;
  };

  const obterPontoMaisProximo = (local: { x: number; y: number }) => {
    if (!pontosAtivos.length) return { ponto: null, dist: 999 };
    const p = [...pontosAtivos].sort(
      (a, b) =>
        Math.hypot(a.x - local.x, (a.y - local.y) * 1.25) -
        Math.hypot(b.x - local.x, (b.y - local.y) * 1.25),
    )[0];
    const dist = p ? Math.hypot(p.x - local.x, (p.y - local.y) * 1.25) : 999;
    return { ponto: p, dist };
  };

  const mover = (e: React.PointerEvent) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    if (!r.width || !r.height) return;
    const local = {
      x: ((e.clientX - r.left) / r.width) * 100,
      y: ((e.clientY - r.top) / r.height) * 100,
    };
    setPos(local);

    // Se está em contagem, tempo de latência ou popup aberto, bloqueia detecção imediata
    if (
      contagem !== null ||
      Date.now() < bloqueioDetecaoAte.current ||
      popupEncontrado ||
      pontoAtivo
    ) {
      return local;
    }

    const { ponto, dist } = obterPontoMaisProximo(local);
    if (ponto && dist < 5.8) {
      // Dispara o popup dizendo som encontrado se ainda não respondeu este
      if (!acertos[ponto.id]) {
        setPopupEncontrado(ponto);
        setMsg("Som encontrado!");
      }
    }

    return local;
  };

  const clicar = (e: React.PointerEvent) => {
    const local = mover(e);
    if (!local) return;

    if (contagem !== null || popupEncontrado || pontoAtivo) return;

    const { ponto: p, dist } = obterPontoMaisProximo(local);
    if (p && dist < 5.8) {
      if (isPulmonar) {
        setPopupEncontrado(p);
      } else {
        abrirTelaExame(p);
      }
    } else {
      setMsg("Nenhum foco aqui. Tente outro ponto.");
    }
  };

  const abrirTelaExame = (p: Ponto) => {
    setPopupEncontrado(null);
    setPontoAtivo(p);
    setOpcaoSelecionada(null);
    setStatusFeedback(null);
    setMsg(`Auscultando: ${p.nome}`);

    audio.current?.pause();
    const a = new Audio(p.som);
    try {
      a.loop = true;
    } catch {
      // fallback
    }
    audio.current = a;
    setIsPlaying(true);

    const playPromise = a.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {
        setIsPlaying(false);
      });
    }
  };

  const fecharPopupEncontrado = () => {
    setPopupEncontrado(null);
    darCooldown(1200);
    setMsg("Mova o estetoscópio sobre o tórax para encontrar os sons.");
  };

  const fecharTelaExame = () => {
    audio.current?.pause();
    setIsPlaying(false);
    setPontoAtivo(null);
    setOpcaoSelecionada(null);
    setStatusFeedback(null);
    darCooldown(1200);
    setMsg("Mova o estetoscópio sobre o tórax para encontrar os sons.");
  };

  const togglePlayAudio = () => {
    if (!audio.current) return;
    if (isPlaying) {
      audio.current.pause();
      setIsPlaying(false);
    } else {
      const playPromise = audio.current.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(() => setIsPlaying(false));
      }
      setIsPlaying(true);
    }
  };

  const reiniciarSom = () => {
    if (!audio.current) return;
    audio.current.currentTime = 0;
    const playPromise = audio.current.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => setIsPlaying(false));
    }
    setIsPlaying(true);
  };

  const responderOpcao = (opcao: string) => {
    if (!pontoAtivo || !pontoAtivo.correto) return;
    setOpcaoSelecionada(opcao);
    const acertou = opcao === pontoAtivo.correto;

    if (acertou) {
      setStatusFeedback("correto");
      setAcertos((prev) => ({ ...prev, [pontoAtivo.id]: true }));
    } else {
      setStatusFeedback("errado");
    }
  };

  const reiniciarDesafio = () => {
    fecharTelaExame();
    setAcertos({});
    setPontosAtivos(gerarPontosPulmonaresAleatorios());
    iniciarContagem();
  };

  const todosAcertados =
    isPulmonar && pontosAtivos.length > 0 && Object.keys(acertos).length === pontosAtivos.length;

  return (
    <main className="flex min-h-screen flex-col items-center px-4 py-8">
      {/* Cabeçalho no padrão do site */}
      <div className="flex w-full max-w-3xl items-center justify-between">
        <Link to="/escolha" className="text-lg italic hover:underline">
          ← voltar
        </Link>
        <h1 className="text-5xl italic">{titulo.toLowerCase()}</h1>
        {isPulmonar ? (
          <button
            onClick={reiniciarDesafio}
            title="Sortear novos locais"
            className="text-sm italic text-muted-foreground hover:text-foreground hover:underline"
          >
            embaralhar
          </button>
        ) : (
          <span className="w-16" />
        )}
      </div>

      {/* Mensagem discreta */}
      <p className="mt-4 min-h-7 text-center text-xl italic text-muted-foreground">{msg}</p>

      {/* Tórax Anatômico Polido */}
      <div
        ref={ref}
        aria-label="Tórax para ausculta"
        onPointerDown={(e) => {
          if (e.button !== 0) return;
          e.currentTarget.setPointerCapture(e.pointerId);
          mover(e);
        }}
        onPointerMove={mover}
        onPointerLeave={(e) => {
          if (e.pointerType === "mouse") setPos(null);
        }}
        onPointerCancel={() => setPos(null)}
        onPointerUp={(e) => {
          if (e.button === 0) clicar(e);
        }}
        className="relative mt-4 aspect-[4/5] w-full max-w-md touch-none cursor-none select-none overflow-hidden rounded-3xl border-2 border-border/60 bg-card/40 p-4 shadow-xl"
      >
        <svg viewBox="0 0 100 125" className="h-full w-full drop-shadow-md">
          <defs>
            <linearGradient id="skinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--skin)" stopOpacity="0.95" />
              <stop offset="50%" stopColor="var(--skin)" stopOpacity="1" />
              <stop offset="100%" stopColor="var(--skin-shade)" stopOpacity="0.9" />
            </linearGradient>
            <radialGradient id="chestHighlight" cx="50%" cy="40%" r="55%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.18" />
              <stop offset="60%" stopColor="#ffffff" stopOpacity="0.03" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0.18" />
            </radialGradient>
          </defs>

          {/* Pescoço com contornos anatômicos suaves */}
          <path
            d="M40 3 Q50 0 60 3 Q65 12 60 22 L60 27 L40 27 L40 22 Q35 12 40 3 Z"
            fill="url(#skinGrad)"
          />

          {/* Tronco completo e ombros com silhueta refinada */}
          <path
            d="M40 24 Q30 27 15 31 C8 34 5 42 7 50 L9 72 C12 73 15 71 16 54 L18 118 Q50 124 82 118 L84 54 C85 71 88 73 91 72 L93 50 C95 42 92 34 85 31 Q70 27 60 24 Q50 31 40 24 Z"
            fill="url(#skinGrad)"
          />

          {/* Camada de luz e volume muscular no tórax */}
          <path
            d="M40 24 Q30 27 15 31 C8 34 5 42 7 50 L9 72 C12 73 15 71 16 54 L18 118 Q50 124 82 118 L84 54 C85 71 88 73 91 72 L93 50 C95 42 92 34 85 31 Q70 27 60 24 Q50 31 40 24 Z"
            fill="url(#chestHighlight)"
          />

          {/* Linhas anatômicas: clavículas, esterno, costelas e arcos costais */}
          <g className="stroke-skin-shade" strokeWidth="0.8" fill="none" strokeLinecap="round">
            {/* Fúrcula e Clavículas */}
            <path d="M47 25 Q50 28 53 25" />
            <path d="M47 27 Q35 26 23 30" />
            <path d="M53 27 Q65 26 77 30" />

            {/* Esterno */}
            <path d="M50 28 L50 64" />
            <path d="M48 64 L52 64" strokeWidth="1" />

            {/* Peitorais */}
            <path d="M25 46 Q36 54 48 50" />
            <path d="M75 46 Q64 54 52 50" />

            {/* Arcos Costais Inferiores */}
            <path d="M50 66 Q38 72 26 82" />
            <path d="M50 66 Q62 72 74 82" />

            {/* Linhas das costelas suaves */}
            <path d="M30 68 Q40 70 47 68 M53 68 Q60 70 70 68" opacity="0.6" />
            <path d="M32 78 Q40 80 47 78 M53 78 Q60 80 68 78" opacity="0.6" />

            {/* Linha Alba e flancos */}
            <path d="M50 67 L50 114" opacity="0.4" strokeDasharray="1.5 2" />
            <path d="M18 52 L18 42 M82 52 L82 42" opacity="0.5" />
          </g>

          {/* Mamilos */}
          <circle cx="34" cy="52" r="1.1" className="fill-skin-shade" opacity="0.75" />
          <circle cx="66" cy="52" r="1.1" className="fill-skin-shade" opacity="0.75" />

          {/* Umbigo */}
          <circle cx="50" cy="98" r="1.1" className="fill-skin-shade" opacity="0.8" />
        </svg>

        {/* No modo cardíaco mantém os pontos sutis. No pulmonar os pontos NÃO aparecem para incentivar a exploração! */}
        {!isPulmonar &&
          pontosAtivos.map((p) => (
            <span
              key={p.id}
              title={p.nome}
              className="ausculta-point absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-foreground/40"
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
            />
          ))}

        {/* Estetoscópio virtual que segue o cursor ou toque */}
        {pos && (
          <div
            className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-muted bg-secondary/80 shadow-lg"
            style={{ left: `${pos.x}%`, top: `${pos.y}%`, width: 44, height: 44 }}
          >
            <div className="flex h-full w-full items-center justify-center">
              <Stethoscope className="h-5 w-5 text-foreground/75" />
            </div>
          </div>
        )}

        {/* Contagem regressiva de 3 segundos com latência de proteção */}
        {contagem !== null && (
          <div className="pointer-events-auto absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in">
            <div className="flex flex-col items-center gap-2 text-center">
              <span className="text-xs uppercase tracking-widest text-muted-foreground">
                preparando ausculta
              </span>
              <div
                key={contagem}
                className="font-serif text-8xl italic text-primary animate-in zoom-in-50 duration-200"
              >
                {contagem === 0 ? "valendo!" : contagem}
              </div>
              <p className="max-w-xs text-sm italic text-muted-foreground">
                prepare o estetoscópio para explorar o tórax...
              </p>
            </div>
          </div>
        )}
      </div>

      {/* POPUP INTRODUÇÃO (Máximo 2 linhas conforme solicitado) */}
      {modalIntro && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-sm rounded-3xl border-2 border-border bg-card p-6 text-center shadow-2xl animate-in zoom-in-95">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-border bg-secondary text-primary">
              <Stethoscope className="h-7 w-7" />
            </div>

            <h2 className="mt-4 text-3xl italic font-serif">ausculta pulmonar</h2>
            <p className="mt-3 text-base text-muted-foreground leading-relaxed">
              Mova o estetoscópio pelo tórax para encontrar os sons ocultos.
              <br />
              Ao localizar um som, identifique a alteração respiratória.
            </p>

            <button
              onClick={fecharIntroEIniciar}
              className="mt-6 w-full rounded-2xl border-2 border-border bg-primary px-6 py-3.5 text-2xl italic text-primary-foreground transition hover:opacity-90 active:scale-95"
            >
              Iniciar
            </button>
          </div>
        </div>
      )}

      {/* POPUP 1: Som Encontrado! */}
      {popupEncontrado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-sm rounded-3xl border-2 border-border bg-card p-6 text-center shadow-2xl">
            <button
              onClick={fecharPopupEncontrado}
              className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-border bg-secondary text-primary">
              <Stethoscope className="h-8 w-8" />
            </div>

            <h2 className="mt-4 text-3xl italic">som encontrado!</h2>
            <p className="mt-2 text-base text-muted-foreground">
              Você localizou um ponto de ausculta no tórax. Pronto para escutar e identificar o som?
            </p>

            <div className="mt-6 flex flex-col gap-3">
              <button
                onClick={() => abrirTelaExame(popupEncontrado)}
                className="w-full rounded-2xl border-2 border-border bg-primary px-6 py-3.5 text-2xl italic text-primary-foreground transition hover:opacity-90 active:scale-95"
              >
                OK (Examinar)
              </button>
              <button
                onClick={fecharPopupEncontrado}
                className="text-base italic text-muted-foreground hover:underline"
              >
                continuar procurando
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POPUP 2: Tela de Acertar / Quiz com Player Tocando */}
      {pontoAtivo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md animate-in fade-in">
          <div className="relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-y-auto rounded-3xl border-2 border-border bg-card p-6 shadow-2xl md:p-8">
            {/* Topo do Modal */}
            <div className="flex items-center justify-between border-b border-border/40 pb-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-primary">
                  <Volume2 className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="text-3xl italic">ausculta</h2>
                  <p className="text-xs text-muted-foreground">{pontoAtivo.nome}</p>
                </div>
              </div>
              <button
                onClick={fecharTelaExame}
                className="rounded-xl border border-border p-2 text-muted-foreground transition hover:bg-secondary hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Barra de Reprodução */}
            <div className="mt-5 flex items-center justify-between rounded-2xl border-2 border-border bg-secondary/30 p-4">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={togglePlayAudio}
                  className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-lg italic text-primary-foreground transition hover:opacity-90 active:scale-95"
                >
                  {isPlaying ? (
                    <Pause className="h-5 w-5" />
                  ) : (
                    <Play className="h-5 w-5 fill-current" />
                  )}
                  <span>{isPlaying ? "Pausar" : "Tocar"}</span>
                </button>
                <button
                  type="button"
                  onClick={reiniciarSom}
                  title="Reiniciar áudio"
                  className="rounded-xl border border-border bg-card p-2.5 transition hover:bg-secondary"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              </div>

              {/* Ondas sonoras animadas */}
              <div className="flex items-end gap-1 px-3 py-1">
                <span
                  className={`w-1 rounded-full bg-accent transition-all ${
                    isPlaying ? "animate-sound-bar-1" : "h-2 opacity-30"
                  }`}
                />
                <span
                  className={`w-1 rounded-full bg-accent transition-all ${
                    isPlaying ? "animate-sound-bar-2" : "h-2 opacity-30"
                  }`}
                />
                <span
                  className={`w-1 rounded-full bg-accent transition-all ${
                    isPlaying ? "animate-sound-bar-3" : "h-2 opacity-30"
                  }`}
                />
                <span
                  className={`w-1 rounded-full bg-accent transition-all ${
                    isPlaying ? "animate-sound-bar-4" : "h-2 opacity-30"
                  }`}
                />
                <span
                  className={`w-1 rounded-full bg-accent transition-all ${
                    isPlaying ? "animate-sound-bar-5" : "h-2 opacity-30"
                  }`}
                />
              </div>
            </div>

            {/* Desafio de Múltipla Escolha */}
            {pontoAtivo.correto && pontoAtivo.opcoes && (
              <div className="mt-8">
                <p className="text-2xl italic">qual é o som?</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Selecione entre as opções o som respiratório correto:
                </p>

                <div className="mt-5 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                  {pontoAtivo.opcoes.map((opcao) => {
                    const foiSelecionada = opcaoSelecionada === opcao;
                    const eCorreta = opcao === pontoAtivo.correto;

                    let estilo =
                      "rounded-2xl border-2 border-border bg-card p-4.5 text-left text-lg italic transition hover:bg-secondary";

                    if (foiSelecionada) {
                      if (eCorreta) {
                        estilo =
                          "rounded-2xl border-2 border-emerald-400 bg-emerald-600 text-white font-bold ring-4 ring-emerald-400/40";
                      } else {
                        // Efeito de erro ("so q vermeio") com animação de shake
                        estilo =
                          "rounded-2xl border-2 border-rose-500 bg-rose-600 text-white font-bold ring-4 ring-rose-500/50 animate-shake";
                      }
                    } else if (statusFeedback === "correto" && eCorreta) {
                      estilo =
                        "rounded-2xl border-2 border-emerald-500 bg-emerald-600/30 text-emerald-200 font-bold";
                    }

                    return (
                      <button
                        key={opcao}
                        type="button"
                        onClick={() => responderOpcao(opcao)}
                        className={estilo}
                      >
                        <div className="flex items-center justify-between">
                          <span>{opcao}</span>
                          {foiSelecionada && eCorreta && (
                            <CheckCircle2 className="h-5 w-5 shrink-0" />
                          )}
                          {foiSelecionada && !eCorreta && (
                            <AlertCircle className="h-5 w-5 shrink-0" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Feedback de Acerto */}
                {statusFeedback === "correto" && (
                  <div className="mt-6 rounded-2xl border-2 border-emerald-400/60 bg-emerald-950/40 p-5 text-emerald-200">
                    <div className="flex items-center gap-2 text-xl font-bold italic text-emerald-300">
                      <CheckCircle2 className="h-6 w-6 text-emerald-400" />
                      <span>Correto! É {pontoAtivo.correto}!</span>
                    </div>
                    {pontoAtivo.descricao && (
                      <p className="mt-2 text-sm leading-relaxed text-emerald-100/90">
                        {pontoAtivo.descricao}
                      </p>
                    )}
                    <button
                      onClick={fecharTelaExame}
                      className="mt-4 w-full rounded-xl border border-emerald-400 bg-emerald-700/60 px-4 py-2.5 text-lg italic text-white transition hover:bg-emerald-600"
                    >
                      Continuar ausculta →
                    </button>
                  </div>
                )}

                {/* Feedback de Erro (Vermelho) */}
                {statusFeedback === "errado" && (
                  <div className="mt-5 rounded-2xl border-2 border-rose-500/60 bg-rose-950/40 p-4 text-rose-200">
                    <div className="flex items-center gap-2 text-lg font-bold italic text-rose-300">
                      <AlertCircle className="h-5 w-5 text-rose-400" />
                      <span>Incorreto!</span>
                    </div>
                    <p className="mt-1 text-sm text-rose-200/90">
                      Esse não é o som certo. Ouça com atenção novamente e escolha outra opção.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Banner de Celebração quando dominar todos os sons */}
      {todosAcertados && (
        <div className="mt-6 flex items-center gap-2 rounded-2xl border-2 border-emerald-400 bg-emerald-950/50 px-6 py-4 text-emerald-200 shadow-xl">
          <Sparkles className="h-6 w-6 text-emerald-400" />
          <span className="text-xl italic">
            Parabéns! Você encontrou e acertou todos os sons pulmonares!
          </span>
        </div>
      )}
    </main>
  );
}
