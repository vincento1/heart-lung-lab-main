import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { Ausculta, pontosCardiacos } from "@/components/Ausculta";

vi.mock("@tanstack/react-router", () => ({ Link: ({ children }: { children: React.ReactNode }) => <a>{children}</a> }));
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

it("ausculta no primeiro toque sem movimento prévio do mouse", () => {
  const play = vi.fn().mockResolvedValue(undefined);
  const audio = vi.fn(function () { return { play, pause: vi.fn() }; });
  vi.stubGlobal("Audio", audio);
  render(<Ausculta titulo="Cardíaca" pontos={pontosCardiacos} />);
  const torax = screen.getByLabelText("Tórax para ausculta");
  vi.spyOn(torax, "getBoundingClientRect").mockReturnValue({ left: 0, top: 0, width: 400, height: 500 } as DOMRect);
  fireEvent(torax, new MouseEvent("pointerup", { bubbles: true, clientX: 252, clientY: 240, button: 0 }));
  expect(audio).toHaveBeenCalledWith("/sons/coracao-mitral.mp3");
  expect(play).toHaveBeenCalledTimes(1);
});