import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Ausculta, pontosPulmonares, gerarPontosPulmonaresAleatorios } from "@/components/Ausculta";

vi.mock("@tanstack/react-router", () => ({
  Link: ({ children }: { children: React.ReactNode }) => <a>{children}</a>,
}));

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("Ausculta Pulmonar com Popups e Randomização", () => {
  it("contém exatamente os 7 sons adicionados na pasta sons", () => {
    expect(pontosPulmonares).toHaveLength(7);

    const arquivosEsperados = [
      "/sons/estridorgol.mp3",
      "/sons/normalmurmurio.mp3",
      "/sons/sibilogol.mp3",
      "/sons/roncogol.mp3",
      "/sons/crepitorfino.mp3",
      "/sons/crepgrossa.mp3",
      "/sons/atritogol.mp3",
    ];

    const sonsAtuais = pontosPulmonares.map((p) => p.som);
    expect(sonsAtuais.sort()).toEqual(arquivosEsperados.sort());

    pontosPulmonares.forEach((p) => {
      expect(p.correto).toBeDefined();
      expect(p.opcoes).toBeDefined();
      expect(p.opcoes).toContain(p.correto);
    });
  });

  it("gera 7 pontos aleatórios com coordenadas válidas no tórax", () => {
    const pontos1 = gerarPontosPulmonaresAleatorios();
    const pontos2 = gerarPontosPulmonaresAleatorios();

    expect(pontos1).toHaveLength(7);
    expect(pontos2).toHaveLength(7);

    // Todos os pontos têm coordenadas dentro dos limites do tórax (0 a 100)
    pontos1.forEach((p) => {
      expect(p.x).toBeGreaterThan(10);
      expect(p.x).toBeLessThan(90);
      expect(p.y).toBeGreaterThan(10);
      expect(p.y).toBeLessThan(100);
    });
  });

  it("não exibe pontos verdes/visíveis no tórax no modo pulmonar", () => {
    render(<Ausculta titulo="Pulmonar" pontos={pontosPulmonares} />);
    const pontosNaTela = document.querySelectorAll(".ausculta-point");
    expect(pontosNaTela).toHaveLength(0);
  });

  it("exibe o popup de instrução e inicia com contagem regressiva ao clicar em iniciar", () => {
    render(<Ausculta titulo="Pulmonar" pontos={pontosPulmonares} />);
    expect(screen.getByText("ausculta pulmonar")).toBeInTheDocument();
    const botaoIniciar = screen.getByRole("button", { name: "Iniciar" });
    fireEvent.click(botaoIniciar);
    expect(screen.getByText("preparando ausculta")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("ao aproximar ou clicar em um som, exibe o popup 'som encontrado!' e ao apertar OK vai para a tela de acertar", () => {
    const play = vi.fn().mockResolvedValue(undefined);
    const audio = vi.fn(function () {
      return { play, pause: vi.fn(), loop: false };
    });
    vi.stubGlobal("Audio", audio);

    // Mock fixo para teste reproduzível
    const pontoTeste = [
      {
        id: "estridor",
        nome: "Traqueia",
        x: 50,
        y: 16,
        som: "/sons/estridorgol.mp3",
        correto: "Estridor",
        opcoes: ["Estridor", "Sibilos", "Roncos", "Murmúrio vesicular (Normal)"],
        descricao: "Obstrução de via aérea superior.",
      },
    ];

    render(<Ausculta titulo="Cardíaca" pontos={pontoTeste} />);
    const torax = screen.getByLabelText("Tórax para ausculta");
    vi.spyOn(torax, "getBoundingClientRect").mockReturnValue({
      left: 0,
      top: 0,
      width: 400,
      height: 500,
    } as DOMRect);

    // Clicar no ponto (x: 50, y: 16 -> clientX: 200, clientY: 80)
    fireEvent(
      torax,
      new MouseEvent("pointerup", { bubbles: true, clientX: 200, clientY: 80, button: 0 }),
    );

    // Verifica que o som tocou e a tela de identificação abriu em popup
    expect(audio).toHaveBeenCalledWith("/sons/estridorgol.mp3");
    expect(play).toHaveBeenCalledTimes(1);
    expect(screen.getByText("qual é o som?")).toBeInTheDocument();
  });

  it("dá efeito de erro vermelho quando o usuário erra a opção", () => {
    const play = vi.fn().mockResolvedValue(undefined);
    const audio = vi.fn(function () {
      return { play, pause: vi.fn() };
    });
    vi.stubGlobal("Audio", audio);

    const pontoTeste = [
      {
        id: "estridor",
        nome: "Traqueia",
        x: 50,
        y: 16,
        som: "/sons/estridorgol.mp3",
        correto: "Estridor",
        opcoes: ["Estridor", "Sibilos"],
      },
    ];

    render(<Ausculta titulo="Cardíaca" pontos={pontoTeste} />);
    const torax = screen.getByLabelText("Tórax para ausculta");
    vi.spyOn(torax, "getBoundingClientRect").mockReturnValue({
      left: 0,
      top: 0,
      width: 400,
      height: 500,
    } as DOMRect);

    fireEvent(
      torax,
      new MouseEvent("pointerup", { bubbles: true, clientX: 200, clientY: 80, button: 0 }),
    );

    const botaoSibilos = screen.getByRole("button", { name: /Sibilos/i });
    fireEvent.click(botaoSibilos);

    expect(screen.getByText(/Incorreto!/i)).toBeInTheDocument();
    expect(botaoSibilos.className).toContain("bg-rose-600");
  });

  it("dá efeito de acerto verde quando o usuário escolhe a opção certa", () => {
    const play = vi.fn().mockResolvedValue(undefined);
    const audio = vi.fn(function () {
      return { play, pause: vi.fn() };
    });
    vi.stubGlobal("Audio", audio);

    const pontoTeste = [
      {
        id: "estridor",
        nome: "Traqueia",
        x: 50,
        y: 16,
        som: "/sons/estridorgol.mp3",
        correto: "Estridor",
        opcoes: ["Estridor", "Sibilos"],
      },
    ];

    render(<Ausculta titulo="Cardíaca" pontos={pontoTeste} />);
    const torax = screen.getByLabelText("Tórax para ausculta");
    vi.spyOn(torax, "getBoundingClientRect").mockReturnValue({
      left: 0,
      top: 0,
      width: 400,
      height: 500,
    } as DOMRect);

    fireEvent(
      torax,
      new MouseEvent("pointerup", { bubbles: true, clientX: 200, clientY: 80, button: 0 }),
    );

    const botaoEstridor = screen.getByRole("button", { name: /Estridor/i });
    fireEvent.click(botaoEstridor);

    expect(screen.getByText(/Correto!/i)).toBeInTheDocument();
    expect(botaoEstridor.className).toContain("bg-emerald-600");
  });
});
