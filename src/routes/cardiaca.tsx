import { createFileRoute } from "@tanstack/react-router";
import { Ausculta, pontosCardiacos } from "@/components/Ausculta";

export const Route = createFileRoute("/cardiaca")({
  head: () => ({ meta: [{ title: "Ausculta cardíaca — medscuta" }, { name: "description", content: "Treine a ausculta cardíaca." }, { property: "og:title", content: "Ausculta cardíaca — medscuta" }, { property: "og:description", content: "Treine a ausculta cardíaca." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: () => <Ausculta titulo="Cardíaca" pontos={pontosCardiacos} />,
});
