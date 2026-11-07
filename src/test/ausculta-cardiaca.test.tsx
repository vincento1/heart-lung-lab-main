import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  AuscultaCardiaca,
  focosCardiacosAnatomicos,
  sonsCardiacosLista,
} from "@/components/AuscultaCardiaca";

vi.mock("@tanstack/react-router", () => ({
  Link: ({ children }: { children: React.ReactNode }) => <a>{children}</a>,
}));

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("Ausculta Cardíaca: Focos, Sons, Valvulopatias e Esquema Semiológico", () => {
  it("posiciona os 5 focos anatômicos com o mitral na linha hemiclavicular", () => {
    expect(focosCardiacosAnatomicos).toHaveLength(5);
    const mitral = focosCardiacosAnatomicos.find((f) => f.id === "mitral");
    const tricuspide = focosCardiacosAnatomicos.find((f) => f.id === "tricuspide");

    expect(mitral).toMatchObject({ x: 67, y: 53 });
    expect(mitral?.x).toBeGreaterThan(tricuspide?.x ?? 0);
  });

  it("exibe o popup de instrução inicial antes de começar e fecha ao clicar em iniciar", () => {
    render(<AuscultaCardiaca />);

    expect(
      screen.getByText(/Identifique os focos no tórax ou pule direto para a ausculta/i),
    ).toBeInTheDocument();

    const botaoIniciar = screen.getByRole("button", { name: /Iniciar/i });
    fireEvent.click(botaoIniciar);

    expect(
      screen.queryByText(/Identifique os focos no tórax ou pule direto para a ausculta/i),
    ).not.toBeInTheDocument();
  });

  it("permite clicar em um foco no tórax e identificar o nome", () => {
    render(<AuscultaCardiaca />);

    // Fecha o modal de introdução
    fireEvent.click(screen.getByRole("button", { name: /Iniciar/i }));

    // Foco aórtico (primeiro botão de foco)
    const botoesFoco = screen.getAllByRole("button", { name: /Foco cardíaco não identificado/i });
    expect(botoesFoco).toHaveLength(5);

    // Clicar no foco aórtico
    fireEvent.click(botoesFoco[0]);

    // Abre o modal de identificação
    expect(screen.getByText("qual é este foco?")).toBeInTheDocument();

    // Clicar na opção "Foco aórtico"
    const opcaoAortico = screen.getByRole("button", { name: "Foco aórtico" });
    fireEvent.click(opcaoAortico);

    // Agora 1 foco está acertado
    expect(screen.getByText(/Focos identificados:/i)).toHaveTextContent("1 de 5");
  });

  it("permite pular os focos e ir direto para a ausculta", () => {
    render(<AuscultaCardiaca />);

    // Fecha o modal de introdução
    fireEvent.click(screen.getByRole("button", { name: /Iniciar/i }));

    const botaoPular = screen.getByRole("button", {
      name: /Pular focos e ir direto para a ausculta/i,
    });
    expect(botaoPular).toBeInTheDocument();

    fireEvent.click(botaoPular);

    // Abre o popup genérico sem entregar o foco
    expect(screen.getByText(/Em um dos focos você encontrou esse som/i)).toBeInTheDocument();
  });

  it("abre o popup de transição sem especificar o foco quando todos os 5 focos são acertados", () => {
    const play = vi.fn().mockResolvedValue(undefined);
    const audio = vi.fn(function () {
      return { play, pause: vi.fn(), loop: false };
    });
    vi.stubGlobal("Audio", audio);

    render(<AuscultaCardiaca />);

    // Fecha o modal de introdução
    fireEvent.click(screen.getByRole("button", { name: /Iniciar/i }));

    // Responde os 5 focos sequencialmente
    for (let i = 0; i < focosCardiacosAnatomicos.length; i++) {
      const foco = focosCardiacosAnatomicos[i];
      const botoes = screen.getAllByRole("button", { name: /Foco cardíaco não identificado/i });
      fireEvent.click(botoes[0]);
      const opcao = screen.getByRole("button", { name: foco.nome });
      fireEvent.click(opcao);
    }

    // Surge a mensagem genérica solicitada: "Em um dos focos você encontrou esse som."
    expect(screen.getByText(/Em um dos focos você encontrou esse som/i)).toBeInTheDocument();

    // Clica no botão de ouvir som
    const botaoOk = screen.getByRole("button", { name: /Ouvir som/i });
    fireEvent.click(botaoOk);

    // Verifica que o som começou a tocar e o player de ausculta cardíaca abriu
    expect(audio).toHaveBeenCalled();
    expect(play).toHaveBeenCalled();
    expect(screen.getByText("qual é o som?")).toBeInTheDocument();
  });

  it("contém a lista com os 8 sons cardíacos da pasta cardio", () => {
    expect(sonsCardiacosLista).toHaveLength(8);
    const arquivos = sonsCardiacosLista.map((s) => s.arquivo);
    expect(arquivos).toContain("/sonscardio/cardio/bulhasnormais.mp3");
    expect(arquivos).toContain("/sonscardio/cardio/desdobramento-b2.mp3");
    expect(arquivos).toContain("/sonscardio/cardio/b3.mp3");
    expect(arquivos).toContain("/sonscardio/cardio/b4.mp3");
    expect(arquivos).toContain("/sonscardio/cardio/ejetivo.mp3");
    expect(arquivos).toContain("/sonscardio/cardio/aspirativo.mp3");
    expect(arquivos).toContain("/sonscardio/cardio/regurgitante.mp3");
    expect(arquivos).toContain("/sonscardio/cardio/em-ruflar.mp3");
  });
});
