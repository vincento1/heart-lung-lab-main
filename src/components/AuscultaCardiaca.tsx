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
  Heart,
  ArrowRight,
  RotateCw,
  FastForward,
} from "lucide-react";

export type FocoCardia = {
  id: string;
  nome: string;
  x: number;
  y: number;
  descricao: string;
};

export const focosCardiacosAnatomicos: FocoCardia[] = [
  {
    id: "aortico",
    nome: "Foco aórtico",
    x: 44,
    y: 30,
    descricao: "2º espaço intercostal direito, junto à borda esternal direita.",
  },
  {
    id: "pulmonar",
    nome: "Foco pulmonar",
    x: 56,
    y: 30,
    descricao: "2º espaço intercostal esquerdo, junto à borda esternal esquerda.",
  },
  {
    id: "acessorio",
    nome: "Foco aórtico acessório (Erb)",
    x: 56,
    y: 36,
    descricao: "3º espaço intercostal esquerdo, junto à borda esternal esquerda.",
  },
  {
    id: "tricuspide",
    nome: "Foco tricúspide",
    x: 52,
    y: 48,
    descricao: "5º espaço intercostal esquerdo, junto à borda esternal inferior.",
  },
  {
    id: "mitral",
    nome: "Foco mitral",
    x: 67,
    y: 53,
    descricao:
      "5º espaço intercostal esquerdo, na linha hemiclavicular esquerda (ápice cardíaco / ictus cordis).",
  },
];

export type SomCardioDef = {
  id: string;
  nome: string;
  arquivo: string;
  focoAssociado: string;
  isSopro: boolean;
  valvulopatia?:
    "Estenose aórtica" | "Insuficiência aórtica" | "Estenose mitral" | "Insuficiência mitral";
  descricao: string;
  ecgInfo: {
    sistole: string;
    diastole: string;
    bulhasDesc: string;
    mecanismo: string;
  };
};

export const sonsCardiacosLista: SomCardioDef[] = [
  {
    id: "normal",
    nome: "Bulhas normais (B1 e B2)",
    arquivo: "/sonscardio/cardio/bulhasnormais.mp3",
    focoAssociado: "Foco mitral",
    isSopro: false,
    descricao:
      "Ritmo cardíaco fisiológico em dois tempos (tum-tá). B1 marca o fechamento das valvas atrioventriculares e B2 o fechamento das valvas semilunares.",
    ecgInfo: {
      sistole: "Intervalo silencioso entre B1 e B2 correspondente à ejeção ventricular.",
      diastole: "Período silencioso de relaxamento e enchimento ventricular após B2.",
      bulhasDesc:
        "B1 ocorre no início da sístole ventricular. B2 encerra a sístole mecânica e inicia a diástole.",
      mecanismo: "Fechamento valvar súbito gerando vibração das cúspides e das paredes cardíacas.",
    },
  },
  {
    id: "desdobramento-b2",
    nome: "Desdobramento de B2",
    arquivo: "/sonscardio/cardio/desdobramento-b2.mp3",
    focoAssociado: "Foco pulmonar",
    isSopro: false,
    descricao:
      "Separação nítida dos componentes aórtico (A2) e pulmonar (P2) de B2, fisiologicamente audível durante a inspiração.",
    ecgInfo: {
      sistole: "Duração normal da sístole ventricular.",
      diastole: "Separação fisiológica de A2 e P2 de 30 a 60 ms no início da diástole.",
      bulhasDesc:
        "A2 fecha primeiro pela maior pressão sistêmica, seguido pelo fechamento pulmonar (P2).",
      mecanismo:
        "A inspiração aumenta o retorno venoso às cavidades direitas, prolongando a ejeção do ventrículo direito.",
    },
  },
  {
    id: "b3",
    nome: "Terceira bulha (B3)",
    arquivo: "/sonscardio/cardio/b3.mp3",
    focoAssociado: "Foco mitral",
    isSopro: false,
    descricao:
      "Som protodiastólico de baixa frequência (galope ventricular / 'tum-tá-tá') gerado no início da diástole.",
    ecgInfo: {
      sistole: "Sístole normal entre B1 e B2.",
      diastole: "B3 surge ~120 a 180 ms após B2 durante a fase de enchimento rápido ventricular.",
      bulhasDesc: "Ocorre durante a fase de enchimento passivo rápido do ventrículo.",
      mecanismo:
        "Desaceleração súbita do influxo de sangue em um ventrículo sobrecarregado de volume ou dilatado (ex.: insuficiência cardíaca).",
    },
  },
  {
    id: "b4",
    nome: "Quarta bulha (B4)",
    arquivo: "/sonscardio/cardio/b4.mp3",
    focoAssociado: "Foco mitral",
    isSopro: false,
    descricao:
      "Som telediastólico / pré-sistólico de baixa frequência (galope atrial / 'tá-tum-tá') originado pela sístole atrial.",
    ecgInfo: {
      sistole: "Precede imediatamente B1.",
      diastole: "Ocorre no final da diástole durante a contração vigorosa do átrio.",
      bulhasDesc:
        "B4 surge associada à sístole atrial. Nunca ocorre em casos de fibrilação atrial.",
      mecanismo:
        "Ejeção atrial vigorosa de sangue contra um ventrículo hipertrofiado ou com complacência diminuída.",
    },
  },
  {
    id: "ejetivo",
    nome: "Sopro ejetivo",
    arquivo: "/sonscardio/cardio/ejetivo.mp3",
    focoAssociado: "Foco aórtico",
    isSopro: true,
    valvulopatia: "Estenose aórtica",
    descricao:
      "Sopro mesossistólico em diamante (crescendo-decrescendo) audível na fase ejetiva com pico no foco aórtico e irradiação carotídea.",
    ecgInfo: {
      sistole: "Sopro em crescendo-decrescendo iniciando após B1 e cessando antes de B2.",
      diastole: "Diástole livre de ruídos anormais.",
      bulhasDesc:
        "B1 preservado, sopro em diamante durante a ejeção e B2 com componente aórtico frequentemente hipofonético.",
      mecanismo:
        "Turbulência originada pelo fluxo forçado através do orifício aórtico estreitado e calcificado.",
    },
  },
  {
    id: "aspirativo",
    nome: "Sopro aspirativo",
    arquivo: "/sonscardio/cardio/aspirativo.mp3",
    focoAssociado: "Foco aórtico acessório (Erb)",
    isSopro: true,
    valvulopatia: "Insuficiência aórtica",
    descricao:
      "Sopro protodiastólico aspirativo de alta frequência em decrescendo que se inicia imediatamente após B2.",
    ecgInfo: {
      sistole: "Sístole livre ou com sopro funcional de hiperfluxo.",
      diastole:
        "Sopro em decrescendo com intensidade máxima imediatamente após o fechamento de B2.",
      bulhasDesc: "B2 marca o início imediato do sopro regurgitante aspirativo.",
      mecanismo:
        "Refluxo de sangue da raiz aórtica para o ventrículo esquerdo pela coaptação incompleta das cúspides da valva aórtica.",
    },
  },
  {
    id: "regurgitante",
    nome: "Sopro regurgitante",
    arquivo: "/sonscardio/cardio/regurgitante.mp3",
    focoAssociado: "Foco mitral",
    isSopro: true,
    valvulopatia: "Insuficiência mitral",
    descricao:
      "Sopro holossistólico (pansistólico) em platô de intensidade constante, preenchendo todo o intervalo de B1 até B2 com irradiação axilar.",
    ecgInfo: {
      sistole: "Sopro em platô contínuo de amplitude uniforme durante toda a sístole ventricular.",
      diastole: "Diástole livre, podendo apresentar B3 de hiperfluxo associada.",
      bulhasDesc: "B1 pode estar hipofonético ou encoberto pelo sopro; o sopro se estende até B2.",
      mecanismo:
        "Refluxo contínuo de sangue do ventrículo para o átrio esquerdo enquanto a pressão ventricular supera a atrial durante toda a sístole.",
    },
  },
  {
    id: "ruflar",
    nome: "Sopro em ruflar",
    arquivo: "/sonscardio/cardio/em-ruflar.mp3",
    focoAssociado: "Foco mitral",
    isSopro: true,
    valvulopatia: "Estenose mitral",
    descricao:
      "Ruflar diastólico de baixa frequência antecedido por estalido de abertura (EA) e seguido de reforço pré-sistólico no ápice.",
    ecgInfo: {
      sistole: "Sístole livre, terminando em B1 tipicamente hiperfonético.",
      diastole:
        "Estalido de abertura (EA) precoce seguido de ruflar em decrescendo e reforço pré-sistólico.",
      bulhasDesc:
        "B1 hiperfonético; após B2 surge o Estalido de Abertura (EA) e o ruflar diastólico.",
      mecanismo:
        "Fluxo turbulento através da valva mitral espessada e estenosada durante o enchimento ventricular diastólico.",
    },
  },
];

/* Funções geradoras de formas de onda fonocardiográficas figuradas (estilo semiologia médica) */
function gerarZigZagHolossistolico(xInicio = 172, xFim = 416, passos = 36, altura = 24) {
  const pontos: string[] = [`M ${xInicio} 100`];
  const passo = (xFim - xInicio) / passos;
  for (let i = 0; i <= passos; i++) {
    const x = xInicio + i * passo;
    const y = i % 2 === 0 ? 100 - altura : 100 + altura;
    pontos.push(`L ${x.toFixed(1)} ${y}`);
  }
  pontos.push(`L ${xFim} 100`);
  return pontos.join(" ");
}

function gerarZigZagDiamante(xInicio = 176, xFim = 416, passos = 32, maxAltura = 26) {
  const pontos: string[] = [`M ${xInicio} 100`];
  const passo = (xFim - xInicio) / passos;
  for (let i = 0; i <= passos; i++) {
    const x = xInicio + i * passo;
    const progresso = i / passos;
    const envelope = Math.sin(progresso * Math.PI);
    const y = i % 2 === 0 ? 100 - maxAltura * envelope : 100 + maxAltura * envelope;
    pontos.push(`L ${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  pontos.push(`L ${xFim} 100`);
  return pontos.join(" ");
}

function gerarZigZagDecrescendo(xInicio = 290, xFim = 475, passos = 28, maxAltura = 25) {
  const pontos: string[] = [`M ${xInicio} 100`];
  const passo = (xFim - xInicio) / passos;
  for (let i = 0; i <= passos; i++) {
    const x = xInicio + i * passo;
    const progresso = i / passos;
    const envelope = Math.max(0, 1 - progresso);
    const y = i % 2 === 0 ? 100 - maxAltura * envelope : 100 + maxAltura * envelope;
    pontos.push(`L ${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  pontos.push(`L ${xFim} 100`);
  return pontos.join(" ");
}

function gerarRuflarDiastolico(xInicio = 278, xFim = 405, passos = 18, altura = 14) {
  const pontos: string[] = [`M ${xInicio} 100`];
  const passo = (xFim - xInicio) / passos;
  for (let i = 0; i <= passos; i++) {
    const x = xInicio + i * passo;
    const progresso = i / passos;
    const envelope = Math.max(0.3, 1 - progresso * 0.7);
    const y = i % 2 === 0 ? 100 - altura * envelope : 100 + altura * envelope;
    pontos.push(`L ${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  return pontos.join(" ");
}

function gerarReforcoPreSistolico(xInicio = 415, xFim = 472, passos = 10, maxAltura = 22) {
  const pontos: string[] = [`M ${xInicio} 100`];
  const passo = (xFim - xInicio) / passos;
  for (let i = 0; i <= passos; i++) {
    const x = xInicio + i * passo;
    const progresso = i / passos;
    const envelope = progresso;
    const y = i % 2 === 0 ? 100 - maxAltura * envelope : 100 + maxAltura * envelope;
    pontos.push(`L ${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  pontos.push(`L ${xFim} 100`);
  return pontos.join(" ");
}

/** Componente figurado e limpo de Fonocardiograma (estilo clássico de semiologia médica) */
function EsquemaFonocardiograma({ som }: { som: SomCardioDef }) {
  return (
    <div className="relative w-full overflow-hidden rounded-2xl border-2 border-slate-700/80 bg-[#161d26] p-8 md:p-10 shadow-2xl">
      <svg viewBox="0 0 600 200" className="h-auto w-full select-none">
        {/* Linha de base horizontal contínua */}
        <line x1="30" y1="100" x2="570" y2="100" stroke="#ffffff" strokeWidth="2.5" />

        {/* 1. BULHAS NORMAIS */}
        {som.id === "normal" && (
          <>
            <rect x="146" y="68" width="24" height="64" fill="#ffffff" rx="1.5" />
            <text
              x="158"
              y="156"
              fill="#ffffff"
              fontSize="20"
              fontWeight="bold"
              textAnchor="middle"
            >
              B1
            </text>

            <rect x="424" y="70" width="22" height="60" fill="#ffffff" rx="1.5" />
            <text
              x="435"
              y="156"
              fill="#ffffff"
              fontSize="20"
              fontWeight="bold"
              textAnchor="middle"
            >
              B2
            </text>

            <text x="290" y="82" fill="#94a3b8" fontSize="13" italic textAnchor="middle">
              Pequeno silêncio (Sístole)
            </text>
            <text x="515" y="82" fill="#94a3b8" fontSize="13" italic textAnchor="middle">
              Grande silêncio (Diástole)
            </text>
          </>
        )}

        {/* 2. DESDOBRAMENTO DE B2 (A2 e P2) */}
        {som.id === "desdobramento-b2" && (
          <>
            <rect x="146" y="68" width="24" height="64" fill="#ffffff" rx="1.5" />
            <text
              x="158"
              y="156"
              fill="#ffffff"
              fontSize="20"
              fontWeight="bold"
              textAnchor="middle"
            >
              B1
            </text>

            {/* A2 e P2 separados */}
            <rect x="408" y="70" width="16" height="60" fill="#ffffff" rx="1.5" />
            <text
              x="416"
              y="156"
              fill="#ffffff"
              fontSize="16"
              fontWeight="bold"
              textAnchor="middle"
            >
              A2
            </text>

            <rect x="438" y="74" width="16" height="52" fill="#ffffff" rx="1.5" />
            <text
              x="446"
              y="156"
              fill="#ffffff"
              fontSize="16"
              fontWeight="bold"
              textAnchor="middle"
            >
              P2
            </text>

            <text x="431" y="52" fill="#38bdf8" fontSize="13" fontWeight="bold" textAnchor="middle">
              B2 Desdobrado (Inspiração)
            </text>
          </>
        )}

        {/* 3. TERCEIRA BULHA (B3) */}
        {som.id === "b3" && (
          <>
            <rect x="136" y="68" width="24" height="64" fill="#ffffff" rx="1.5" />
            <text
              x="148"
              y="156"
              fill="#ffffff"
              fontSize="20"
              fontWeight="bold"
              textAnchor="middle"
            >
              B1
            </text>

            <rect x="346" y="70" width="22" height="60" fill="#ffffff" rx="1.5" />
            <text
              x="357"
              y="156"
              fill="#ffffff"
              fontSize="20"
              fontWeight="bold"
              textAnchor="middle"
            >
              B2
            </text>

            {/* B3 protodiastólico */}
            <rect x="420" y="80" width="18" height="40" fill="#ffffff" rx="1.5" />
            <text
              x="429"
              y="156"
              fill="#f43f5e"
              fontSize="18"
              fontWeight="bold"
              textAnchor="middle"
            >
              B3
            </text>
            <text x="429" y="56" fill="#fda4af" fontSize="13" textAnchor="middle">
              Protodiástole (Enchimento rápido)
            </text>
          </>
        )}

        {/* 4. QUARTA BULHA (B4) */}
        {som.id === "b4" && (
          <>
            {/* B4 telediastólico antes de B1 */}
            <rect x="86" y="81" width="18" height="38" fill="#ffffff" rx="1.5" />
            <text x="95" y="156" fill="#c084fc" fontSize="18" fontWeight="bold" textAnchor="middle">
              B4
            </text>
            <text x="95" y="56" fill="#d8b4fe" fontSize="13" textAnchor="middle">
              Telediástole (Sístole atrial)
            </text>

            <rect x="168" y="68" width="24" height="64" fill="#ffffff" rx="1.5" />
            <text
              x="180"
              y="156"
              fill="#ffffff"
              fontSize="20"
              fontWeight="bold"
              textAnchor="middle"
            >
              B1
            </text>

            <rect x="430" y="70" width="22" height="60" fill="#ffffff" rx="1.5" />
            <text
              x="441"
              y="156"
              fill="#ffffff"
              fontSize="20"
              fontWeight="bold"
              textAnchor="middle"
            >
              B2
            </text>
          </>
        )}

        {/* 5. SOPRO REGURGITANTE (Insuficiência Mitral - idêntico à imagem do usuário) */}
        {som.id === "regurgitante" && (
          <>
            <rect x="146" y="68" width="24" height="64" fill="#ffffff" rx="1.5" />
            <text
              x="158"
              y="156"
              fill="#ffffff"
              fontSize="20"
              fontWeight="bold"
              textAnchor="middle"
            >
              B1
            </text>

            {/* Zigue-zague holossistólico denso e uniforme entre B1 e B2 */}
            <path
              d={gerarZigZagHolossistolico(172, 420, 36, 24)}
              stroke="#ffffff"
              strokeWidth="2.2"
              fill="none"
              strokeLinejoin="bevel"
            />

            <rect x="422" y="70" width="22" height="60" fill="#ffffff" rx="1.5" />
            <text
              x="433"
              y="156"
              fill="#ffffff"
              fontSize="20"
              fontWeight="bold"
              textAnchor="middle"
            >
              B2
            </text>

            <text x="296" y="52" fill="#f472b6" fontSize="13" fontWeight="bold" textAnchor="middle">
              Sopro Holossistólico (em Platô)
            </text>
          </>
        )}

        {/* 6. SOPRO EJETIVO (Estenose Aórtica - Diamante mesossistólico) */}
        {som.id === "ejetivo" && (
          <>
            <rect x="146" y="68" width="24" height="64" fill="#ffffff" rx="1.5" />
            <text
              x="158"
              y="156"
              fill="#ffffff"
              fontSize="20"
              fontWeight="bold"
              textAnchor="middle"
            >
              B1
            </text>

            {/* Zigue-zague em diamante (crescendo-decrescendo) */}
            <path
              d={gerarZigZagDiamante(176, 418, 32, 26)}
              stroke="#ffffff"
              strokeWidth="2.2"
              fill="none"
              strokeLinejoin="bevel"
            />

            <rect x="422" y="70" width="22" height="60" fill="#ffffff" rx="1.5" />
            <text
              x="433"
              y="156"
              fill="#ffffff"
              fontSize="20"
              fontWeight="bold"
              textAnchor="middle"
            >
              B2
            </text>

            <text x="297" y="52" fill="#fbbf24" fontSize="13" fontWeight="bold" textAnchor="middle">
              Sopro Mesossistólico em Diamante (Crescendo-Decrescendo)
            </text>
          </>
        )}

        {/* 7. SOPRO ASPIRATIVO (Insuficiência Aórtica - Protodiastólico em Decrescendo) */}
        {som.id === "aspirativo" && (
          <>
            <rect x="126" y="68" width="24" height="64" fill="#ffffff" rx="1.5" />
            <text
              x="138"
              y="156"
              fill="#ffffff"
              fontSize="20"
              fontWeight="bold"
              textAnchor="middle"
            >
              B1
            </text>

            <rect x="266" y="70" width="22" height="60" fill="#ffffff" rx="1.5" />
            <text
              x="277"
              y="156"
              fill="#ffffff"
              fontSize="20"
              fontWeight="bold"
              textAnchor="middle"
            >
              B2
            </text>

            {/* Zigue-zague em decrescendo imediatamente após B2 */}
            <path
              d={gerarZigZagDecrescendo(290, 480, 28, 25)}
              stroke="#ffffff"
              strokeWidth="2.2"
              fill="none"
              strokeLinejoin="bevel"
            />

            <text x="385" y="52" fill="#67e8f9" fontSize="13" fontWeight="bold" textAnchor="middle">
              Sopro Protodiastólico em Decrescendo (Aspirativo)
            </text>
          </>
        )}

        {/* 8. SOPRO EM RUFLAR (Estenose Mitral - EA + Ruflar Diastólico) */}
        {som.id === "ruflar" && (
          <>
            <rect x="106" y="68" width="24" height="64" fill="#ffffff" rx="1.5" />
            <text
              x="118"
              y="156"
              fill="#ffffff"
              fontSize="20"
              fontWeight="bold"
              textAnchor="middle"
            >
              B1
            </text>

            <rect x="236" y="70" width="22" height="60" fill="#ffffff" rx="1.5" />
            <text
              x="247"
              y="156"
              fill="#ffffff"
              fontSize="20"
              fontWeight="bold"
              textAnchor="middle"
            >
              B2
            </text>

            {/* Estalido de abertura (EA) */}
            <line x1="266" y1="74" x2="266" y2="126" stroke="#ffffff" strokeWidth="3" />
            <text
              x="266"
              y="156"
              fill="#c084fc"
              fontSize="16"
              fontWeight="bold"
              textAnchor="middle"
            >
              EA
            </text>

            {/* Ruflar diastólico em decrescendo + reforço pré-sistólico */}
            <path
              d={gerarRuflarDiastolico(278, 405, 18, 14)}
              stroke="#ffffff"
              strokeWidth="2"
              fill="none"
              strokeLinejoin="bevel"
            />
            <path
              d={gerarReforcoPreSistolico(415, 472, 10, 22)}
              stroke="#ffffff"
              strokeWidth="2"
              fill="none"
              strokeLinejoin="bevel"
            />

            {/* Próximo B1 */}
            <rect x="476" y="68" width="24" height="64" fill="#ffffff" rx="1.5" />
            <text
              x="488"
              y="156"
              fill="#ffffff"
              fontSize="20"
              fontWeight="bold"
              textAnchor="middle"
            >
              B1
            </text>

            <text x="350" y="52" fill="#c4b5fd" fontSize="13" fontWeight="bold" textAnchor="middle">
              Estalido de Abertura (EA) + Ruflar Diastólico
            </text>
          </>
        )}
      </svg>
    </div>
  );
}

export function AuscultaCardiaca() {
  // Modal de introdução inicial (máximo 2 linhas de instrução antes de começar)
  const [modalIntro, setModalIntro] = useState(true);

  const [focoSelecionado, setFocoSelecionado] = useState<FocoCardia | null>(null);
  const [focosAcertados, setFocosAcertados] = useState<Record<string, boolean>>({});
  const [erroFocoOpcao, setErroFocoOpcao] = useState<string | null>(null);

  // Estados do Quiz de Som Cardíaco
  const [modalConclusaoFocos, setModalConclusaoFocos] = useState(false);
  const [somAtual, setSomAtual] = useState<SomCardioDef>(() => sonsCardiacosLista[0]);
  const [modalPlayerSom, setModalPlayerSom] = useState(false);
  const [opcaoSomSelecionada, setOpcaoSomSelecionada] = useState<string | null>(null);
  const [statusFeedbackSom, setStatusFeedbackSom] = useState<"correto" | "errado" | null>(null);

  // Pergunta 2 (Valvulopatia para sopros)
  const [mostrarPerguntaValvulopatia, setMostrarPerguntaValvulopatia] = useState(false);
  const [opcaoValvulaSelecionada, setOpcaoValvulaSelecionada] = useState<string | null>(null);
  const [statusValvula, setStatusValvula] = useState<"correto" | "errado" | null>(null);

  // Tela final do Fonocardiograma esquemático
  const [mostrarTelaECG, setMostrarTelaECG] = useState(false);

  // Áudio Player
  const audio = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    return () => {
      audio.current?.pause();
      audio.current = null;
    };
  }, []);

  const totalFocosAcertados = Object.keys(focosAcertados).length;

  // Ao clicar num foco no tórax (Fase 1)
  const clicarNoFoco = (foco: FocoCardia) => {
    setFocoSelecionado(foco);
    setErroFocoOpcao(null);
  };

  // Responder o nome do foco
  const responderNomeFoco = (nomeEscolhido: string) => {
    if (!focoSelecionado) return;

    if (nomeEscolhido === focoSelecionado.nome) {
      const novosAcertos = { ...focosAcertados, [focoSelecionado.id]: true };
      setFocosAcertados(novosAcertos);
      setFocoSelecionado(null);
      setErroFocoOpcao(null);

      // Se completou todos os 5 focos:
      if (Object.keys(novosAcertos).length === focosCardiacosAnatomicos.length) {
        const somSorteado =
          sonsCardiacosLista[Math.floor(Math.random() * sonsCardiacosLista.length)];
        setSomAtual(somSorteado);
        setModalConclusaoFocos(true);
      }
    } else {
      setErroFocoOpcao(nomeEscolhido);
    }
  };

  // Opção para pular a parte dos focos e ir direto para a ausculta
  const pularFocosDiretoParaAusculta = () => {
    const somSorteado = sonsCardiacosLista[Math.floor(Math.random() * sonsCardiacosLista.length)];
    setSomAtual(somSorteado);
    setModalConclusaoFocos(true);
  };

  // Transição do popup de transição para o Player
  const abrirPlayerSom = () => {
    setModalConclusaoFocos(false);
    setModalPlayerSom(true);
    setOpcaoSomSelecionada(null);
    setStatusFeedbackSom(null);
    setMostrarPerguntaValvulopatia(false);
    setOpcaoValvulaSelecionada(null);
    setStatusValvula(null);

    // Tocar o som do desafio
    audio.current?.pause();
    const a = new Audio(somAtual.arquivo);
    a.loop = true;
    audio.current = a;
    setIsPlaying(true);
    const playPromise = a.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => setIsPlaying(false));
    }
  };

  const togglePlayAudio = () => {
    if (!audio.current) return;
    if (isPlaying) {
      audio.current.pause();
      setIsPlaying(false);
    } else {
      audio.current.play().catch(() => setIsPlaying(false));
      setIsPlaying(true);
    }
  };

  const reiniciarSom = () => {
    if (!audio.current) return;
    audio.current.currentTime = 0;
    audio.current.play().catch(() => setIsPlaying(false));
    setIsPlaying(true);
  };

  const fecharPlayer = () => {
    audio.current?.pause();
    setIsPlaying(false);
    setModalPlayerSom(false);
  };

  // Responder pergunta 1 (Qual é o som)
  const responderSom = (opcao: string) => {
    setOpcaoSomSelecionada(opcao);
    const acertou = opcao === somAtual.nome;

    if (acertou) {
      setStatusFeedbackSom("correto");
      if (somAtual.isSopro) {
        setMostrarPerguntaValvulopatia(true);
      }
    } else {
      setStatusFeedbackSom("errado");
    }
  };

  // Responder pergunta 2 (Valvulopatia)
  const responderValvulopatia = (valvula: string) => {
    setOpcaoValvulaSelecionada(valvula);
    const acertou = valvula === somAtual.valvulopatia;

    if (acertou) {
      setStatusValvula("correto");
    } else {
      setStatusValvula("errado");
    }
  };

  // Ir para a tela esquemática (em silêncio conforme solicitado)
  const irParaECG = () => {
    audio.current?.pause();
    setIsPlaying(false);
    setModalPlayerSom(false);
    setMostrarTelaECG(true);
  };

  const reiniciarComNovoSom = () => {
    setMostrarTelaECG(false);
    const outroSom = sonsCardiacosLista[Math.floor(Math.random() * sonsCardiacosLista.length)];
    setSomAtual(outroSom);
    setModalConclusaoFocos(true);
  };

  const reiniciarTudo = () => {
    setMostrarTelaECG(false);
    setModalPlayerSom(false);
    setModalConclusaoFocos(false);
    setFocosAcertados({});
    setFocoSelecionado(null);
    setModalIntro(false);
  };

  // Opções para a Pergunta 1
  const opcoesPergunta1 = somAtual.isSopro
    ? ["Sopro ejetivo", "Sopro aspirativo", "Sopro regurgitante", "Sopro em ruflar"]
    : [
        "Bulhas normais (B1 e B2)",
        "Desdobramento de B2",
        "Terceira bulha (B3)",
        "Quarta bulha (B4)",
      ];

  // Opções para a Pergunta 2
  const opcoesValvulopatia = [
    "Estenose aórtica",
    "Insuficiência aórtica",
    "Estenose mitral",
    "Insuficiência mitral",
  ];

  return (
    <main className="flex min-h-screen flex-col items-center px-4 py-8">
      {/* Cabeçalho */}
      <div className="flex w-full max-w-3xl items-center justify-between">
        <Link to="/escolha" className="text-lg italic hover:underline">
          ← voltar
        </Link>
        <h1 className="text-5xl italic">cardíaca</h1>
        <button
          onClick={reiniciarTudo}
          className="text-sm italic text-muted-foreground hover:text-foreground hover:underline"
        >
          recomeçar
        </button>
      </div>

      {/* POPUP DE INTRODUÇÃO (máximo 2 linhas de orientação) */}
      {modalIntro && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-sm rounded-3xl border-2 border-border bg-card p-6 text-center shadow-2xl animate-in zoom-in-95">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-border bg-secondary text-primary">
              <Heart className="h-7 w-7" />
            </div>

            <h2 className="mt-4 text-3xl italic font-serif">ausculta cardíaca</h2>
            <p className="mt-3 text-base text-muted-foreground leading-relaxed">
              Identifique os focos no tórax ou pule direto para a ausculta.
              <br />
              Escute com atenção e acerte o som ou sopro apresentado.
            </p>

            <button
              onClick={() => setModalIntro(false)}
              className="mt-6 w-full rounded-2xl border-2 border-border bg-primary px-6 py-3.5 text-2xl italic text-primary-foreground transition hover:opacity-90 active:scale-95"
            >
              Iniciar
            </button>
          </div>
        </div>
      )}

      {/* TELA FINAL: Esquema Fonocardiográfico Figurado + Explicação Concisa */}
      {mostrarTelaECG ? (
        <section className="mt-8 flex w-full max-w-4xl flex-col items-center gap-8 animate-in fade-in">
          <div className="w-full rounded-3xl border-2 border-border bg-card p-6 shadow-2xl md:p-10">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/50 pb-6">
              <div>
                <span className="text-xs uppercase tracking-wider text-muted-foreground">
                  Esquema Semiológico das Bulhas e Sopros
                </span>
                <h2 className="text-3xl italic font-serif text-foreground">
                  {somAtual.nome} {somAtual.valvulopatia ? `— ${somAtual.valvulopatia}` : ""}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={reiniciarComNovoSom}
                  className="flex items-center gap-2 rounded-2xl border-2 border-border bg-secondary/80 px-4 py-2 text-sm italic transition hover:bg-primary hover:text-primary-foreground"
                >
                  <RotateCw className="h-4 w-4" /> Treinar outro som
                </button>
              </div>
            </div>

            {/* Imagem Figurada do Fonocardiograma (estilo clássico de livro-texto de semiologia) */}
            <div className="mt-8">
              <EsquemaFonocardiograma som={somAtual} />
            </div>

            {/* Explicaçãozinha semiológica e fisiopatológica concisa */}
            <div className="mt-8 rounded-2xl border border-border/80 bg-secondary/30 p-6 md:p-7">
              <h3 className="text-xl font-bold italic font-serif text-foreground">
                Explicação Semiológica
              </h3>
              <p className="mt-2 text-base text-foreground/90 leading-relaxed">
                {somAtual.descricao}
              </p>
              <div className="mt-4 border-t border-border/40 pt-3 text-sm text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Mecanismo fisiológico: </strong>
                {somAtual.ecgInfo.mecanismo}
              </div>
            </div>
          </div>
        </section>
      ) : (
        /* FASE 1: O Jogador clica nos focos no tórax para identificar cada um OU pular */
        <>
          <p className="mt-4 min-h-7 text-center text-xl italic text-muted-foreground">
            {totalFocosAcertados === focosCardiacosAnatomicos.length
              ? "Todos os focos identificados! Preparando ausculta..."
              : "Clique nos focos do tórax e identifique o nome anatômico de cada um."}
          </p>

          {/* Botão de Destaque: Pular Focos e Ir Direto para a Ausculta */}
          <button
            onClick={pularFocosDiretoParaAusculta}
            className="mt-3 flex items-center gap-2 rounded-2xl border-2 border-primary/50 bg-primary/10 px-6 py-2.5 text-base md:text-lg font-semibold italic text-primary shadow-md transition hover:bg-primary hover:text-primary-foreground active:scale-95"
          >
            <FastForward className="h-5 w-5" />
            <span>Pular focos e ir direto para a ausculta</span>
          </button>

          <div className="mt-3 flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-1.5 text-sm text-foreground">
            <Heart className="h-4 w-4 text-rose-400" />
            <span>
              Focos identificados: <strong>{totalFocosAcertados}</strong> de{" "}
              {focosCardiacosAnatomicos.length}
            </span>
          </div>

          {/* Tórax com os 5 Focos Cardíacos */}
          <div
            aria-label="Tórax para ausculta cardíaca"
            className="relative mt-4 aspect-[4/5] w-full max-w-md select-none overflow-hidden rounded-3xl border-2 border-border/60 bg-card/40 p-4 shadow-xl"
          >
            <svg viewBox="0 0 100 125" className="h-full w-full drop-shadow-md">
              <defs>
                <linearGradient id="skinGradCardio" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="var(--skin)" stopOpacity="0.95" />
                  <stop offset="50%" stopColor="var(--skin)" stopOpacity="1" />
                  <stop offset="100%" stopColor="var(--skin-shade)" stopOpacity="0.9" />
                </linearGradient>
              </defs>

              {/* Pescoço */}
              <path
                d="M40 3 Q50 0 60 3 Q65 12 60 22 L60 27 L40 27 L40 22 Q35 12 40 3 Z"
                fill="url(#skinGradCardio)"
              />

              {/* Tronco */}
              <path
                d="M40 24 Q30 27 15 31 C8 34 5 42 7 50 L9 72 C12 73 15 71 16 54 L18 118 Q50 124 82 118 L84 54 C85 71 88 73 91 72 L93 50 C95 42 92 34 85 31 Q70 27 60 24 Q50 31 40 24 Z"
                fill="url(#skinGradCardio)"
              />

              {/* Anatomia */}
              <g className="stroke-skin-shade" strokeWidth="0.8" fill="none" strokeLinecap="round">
                <path d="M47 25 Q50 28 53 25" />
                <path d="M47 27 Q35 26 23 30" />
                <path d="M53 27 Q65 26 77 30" />
                <path d="M50 28 L50 64" />
                <path d="M25 46 Q36 54 48 50" />
                <path d="M75 46 Q64 54 52 50" />
                <path d="M50 66 Q38 72 26 82" />
                <path d="M50 66 Q62 72 74 82" />
                <path d="M50 67 L50 114" opacity="0.4" strokeDasharray="1.5 2" />
              </g>

              {/* Mamilo esquerdo marcando a linha hemiclavicular */}
              <circle cx="34" cy="52" r="1.1" className="fill-skin-shade" opacity="0.75" />
              <circle cx="66" cy="52" r="1.1" className="fill-skin-shade" opacity="0.75" />
              <circle cx="50" cy="98" r="1.1" className="fill-skin-shade" opacity="0.8" />
            </svg>

            {/* Os 5 Focos Cardíacos com o Mitral na linha hemiclavicular esquerda (x: 67, y: 53) */}
            {focosCardiacosAnatomicos.map((foco) => {
              const acertado = focosAcertados[foco.id];
              return (
                <button
                  key={foco.id}
                  onClick={() => clicarNoFoco(foco)}
                  title={acertado ? foco.nome : "Foco cardíaco não identificado"}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-300 ${
                    acertado
                      ? "h-7 w-7 border-2 border-emerald-300 bg-emerald-500 shadow-[0_0_12px_#10b981] flex items-center justify-center text-white text-xs font-bold"
                      : "h-6 w-6 border-2 border-white/80 bg-accent/90 hover:scale-125 shadow-lg animate-pulse"
                  }`}
                  style={{ left: `${foco.x}%`, top: `${foco.y}%` }}
                >
                  {acertado ? "✓" : ""}
                </button>
              );
            })}
          </div>
        </>
      )}

      {/* POPUP: Identificar o Foco Cardíaco clicado */}
      {focoSelecionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md rounded-3xl border-2 border-border bg-card p-6 shadow-2xl">
            <button
              onClick={() => setFocoSelecionado(null)}
              className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-border/40 pb-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-secondary text-primary">
                <Heart className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-2xl italic font-serif">qual é este foco?</h3>
                <p className="text-xs text-muted-foreground">{focoSelecionado.descricao}</p>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3.5">
              {focosCardiacosAnatomicos.map((opcao) => {
                const foiErro = erroFocoOpcao === opcao.nome;
                return (
                  <button
                    key={opcao.id}
                    onClick={() => responderNomeFoco(opcao.nome)}
                    className={`rounded-2xl border-2 p-4 text-left text-lg italic transition ${
                      foiErro
                        ? "border-rose-500 bg-rose-600 text-white animate-shake"
                        : "border-border bg-card hover:bg-secondary text-foreground"
                    }`}
                  >
                    {opcao.nome}
                  </button>
                );
              })}
            </div>

            {erroFocoOpcao && (
              <p className="mt-3 text-center text-sm font-semibold text-rose-300">
                ❌ Incorreto! Revise a posição anatômica e tente outro foco.
              </p>
            )}
          </div>
        </div>
      )}

      {/* POPUP: Transição para a Ausculta ("Em um dos focos você encontrou esse som") */}
      {modalConclusaoFocos && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-md rounded-3xl border-2 border-border bg-card p-8 text-center shadow-2xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-border bg-secondary text-primary">
              <Stethoscope className="h-8 w-8" />
            </div>

            <h2 className="mt-4 text-3xl italic">som cardíaco</h2>
            <p className="mt-3 text-xl font-serif text-foreground leading-snug">
              Em um dos focos você encontrou esse som.
            </p>

            <button
              onClick={abrirPlayerSom}
              className="mt-6 w-full rounded-2xl border-2 border-border bg-primary px-8 py-3.5 text-2xl italic text-primary-foreground transition hover:opacity-90 active:scale-95"
            >
              Ouvir som
            </button>
          </div>
        </div>
      )}

      {/* MODAL: Player de Som e Quiz */}
      {modalPlayerSom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md animate-in fade-in">
          <div className="relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-y-auto rounded-3xl border-2 border-border bg-card p-6 shadow-2xl md:p-8">
            {/* Topo do Modal */}
            <div className="flex items-center justify-between border-b border-border/40 pb-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-primary">
                  <Volume2 className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="text-3xl italic font-serif">ausculta cardíaca</h2>
                  <p className="text-xs text-muted-foreground">
                    Em um dos focos você encontrou esse som
                  </p>
                </div>
              </div>
              <button
                onClick={fecharPlayer}
                className="rounded-xl border border-border p-2 text-muted-foreground hover:bg-secondary hover:text-foreground"
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
                  title="Reiniciar som"
                  className="rounded-xl border border-border bg-card p-2.5 hover:bg-secondary"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              </div>

              {/* Ondas sonoras animadas */}
              <div className="flex items-end gap-1 px-3 py-1">
                <span
                  className={`w-1 rounded-full bg-accent transition-all ${isPlaying ? "animate-sound-bar-1" : "h-2 opacity-30"}`}
                />
                <span
                  className={`w-1 rounded-full bg-accent transition-all ${isPlaying ? "animate-sound-bar-2" : "h-2 opacity-30"}`}
                />
                <span
                  className={`w-1 rounded-full bg-accent transition-all ${isPlaying ? "animate-sound-bar-3" : "h-2 opacity-30"}`}
                />
                <span
                  className={`w-1 rounded-full bg-accent transition-all ${isPlaying ? "animate-sound-bar-4" : "h-2 opacity-30"}`}
                />
                <span
                  className={`w-1 rounded-full bg-accent transition-all ${isPlaying ? "animate-sound-bar-5" : "h-2 opacity-30"}`}
                />
              </div>
            </div>

            {/* PERGUNTA 1: Qual som você está ouvindo? */}
            <div className="mt-8">
              <p className="text-2xl italic">qual é o som?</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Selecione entre as opções o som cardíaco auscultado:
              </p>

              <div className="mt-5 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                {opcoesPergunta1.map((op) => {
                  const foiSelecionada = opcaoSomSelecionada === op;
                  const eCorreta = op === somAtual.nome;

                  let estilo =
                    "rounded-2xl border-2 border-border bg-card p-4 text-left text-lg italic transition hover:bg-secondary";
                  if (foiSelecionada) {
                    if (eCorreta) {
                      estilo =
                        "rounded-2xl border-2 border-emerald-400 bg-emerald-600 text-white font-bold ring-4 ring-emerald-400/40";
                    } else {
                      estilo =
                        "rounded-2xl border-2 border-rose-500 bg-rose-600 text-white font-bold ring-4 ring-rose-500/50 animate-shake";
                    }
                  } else if (statusFeedbackSom === "correto" && eCorreta) {
                    estilo =
                      "rounded-2xl border-2 border-emerald-500 bg-emerald-600/30 text-emerald-200 font-bold";
                  }

                  return (
                    <button
                      key={op}
                      type="button"
                      disabled={statusFeedbackSom === "correto"}
                      onClick={() => responderSom(op)}
                      className={estilo}
                    >
                      <div className="flex items-center justify-between">
                        <span>{op}</span>
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

              {statusFeedbackSom === "errado" && (
                <p className="mt-3 text-sm font-semibold text-rose-300">
                  ❌ Incorreto! Escute novamente com atenção e escolha outra opção.
                </p>
              )}

              {/* Se acertou e NÃO é sopro (normal, B2, B3, B4): Botão para o Esquema */}
              {statusFeedbackSom === "correto" && !somAtual.isSopro && (
                <div className="mt-6 rounded-2xl border-2 border-emerald-400/60 bg-emerald-950/40 p-5 text-emerald-200">
                  <div className="flex items-center gap-2 text-xl font-bold italic text-emerald-300">
                    <CheckCircle2 className="h-6 w-6 text-emerald-400" />
                    <span>Correto! Trata-se de {somAtual.nome}!</span>
                  </div>
                  <p className="mt-2 text-sm text-emerald-100/90">{somAtual.descricao}</p>
                  <button
                    onClick={irParaECG}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-400 bg-emerald-700/60 px-4 py-3 text-lg italic text-white transition hover:bg-emerald-600"
                  >
                    <span>Ver o gráfico</span>
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
              )}

              {/* PERGUNTA 2: Se for sopro, abre a segunda pergunta para definir a valvulopatia */}
              {mostrarPerguntaValvulopatia && (
                <div className="mt-8 border-t border-border/50 pt-6 animate-in fade-in">
                  <div className="flex items-center gap-2 text-emerald-300 font-semibold mb-3">
                    <CheckCircle2 className="h-5 w-5" />
                    <span>Sopro identificado! Agora responda a valvulopatia:</span>
                  </div>
                  <p className="text-xl italic">qual é a valvulopatia?</p>

                  <div className="mt-5 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                    {opcoesValvulopatia.map((valvula) => {
                      const selecionada = opcaoValvulaSelecionada === valvula;
                      const correta = valvula === somAtual.valvulopatia;

                      let estiloValvula =
                        "rounded-2xl border-2 border-border bg-card p-4 text-left text-lg italic transition hover:bg-secondary";
                      if (selecionada) {
                        if (correta) {
                          estiloValvula =
                            "rounded-2xl border-2 border-emerald-400 bg-emerald-600 text-white font-bold ring-4 ring-emerald-400/40";
                        } else {
                          estiloValvula =
                            "rounded-2xl border-2 border-rose-500 bg-rose-600 text-white font-bold ring-4 ring-rose-500/50 animate-shake";
                        }
                      } else if (statusValvula === "correto" && correta) {
                        estiloValvula =
                          "rounded-2xl border-2 border-emerald-500 bg-emerald-600/30 text-emerald-200 font-bold";
                      }

                      return (
                        <button
                          key={valvula}
                          type="button"
                          disabled={statusValvula === "correto"}
                          onClick={() => responderValvulopatia(valvula)}
                          className={estiloValvula}
                        >
                          <div className="flex items-center justify-between">
                            <span>{valvula}</span>
                            {selecionada && correta && (
                              <CheckCircle2 className="h-5 w-5 shrink-0" />
                            )}
                            {selecionada && !correta && (
                              <AlertCircle className="h-5 w-5 shrink-0" />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {statusValvula === "errado" && (
                    <p className="mt-3 text-sm font-semibold text-rose-300">
                      ❌ Incorreto! Pense no mecanismo hemodinâmico e tente de novo.
                    </p>
                  )}

                  {/* Se acertou a valvulopatia: Botão para ir para o Esquema */}
                  {statusValvula === "correto" && (
                    <div className="mt-5 rounded-2xl border-2 border-emerald-400/60 bg-emerald-950/40 p-4 text-emerald-200">
                      <div className="flex items-center gap-2 text-lg font-bold italic text-emerald-300">
                        <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                        <span>Excelente! Diagnóstico de {somAtual.valvulopatia} correto!</span>
                      </div>
                      <p className="mt-1 text-xs text-emerald-100/90">{somAtual.descricao}</p>
                      <button
                        onClick={irParaECG}
                        className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-400 bg-emerald-700/60 px-4 py-3 text-lg italic text-white transition hover:bg-emerald-600"
                      >
                        <span>Ver o gráfico</span>
                        <ArrowRight className="h-5 w-5" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
