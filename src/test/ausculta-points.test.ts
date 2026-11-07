import { describe, expect, it } from "vitest";
import { pontosCardiacos } from "@/components/Ausculta";

describe("Focos cardíacos na vista anterior", () => {
  it("posiciona o mitral na linha do mamilo esquerdo e abaixo do tricúspide", () => {
    const mitral = pontosCardiacos.find((p) => p.id === "mitral");
    const tricuspide = pontosCardiacos.find((p) => p.id === "tricuspide");
    expect(mitral).toMatchObject({ x: 63, y: 48 });
    expect(tricuspide).toBeDefined();
    expect(mitral?.x).toBeGreaterThan(tricuspide?.x ?? 100);
    expect(mitral?.y).toBeGreaterThan(tricuspide?.y ?? 100);
  });
});