import { createFileRoute } from "@tanstack/react-router";
import { Ausculta, pontosPulmonares } from "@/components/Ausculta";

export const Route = createFileRoute("/pulmonar")({
  head: () => ({
    meta: [
      { title: "Ausculta pulmonar — medscuta" },
      { name: "description", content: "Treine a ausculta pulmonar." },
      { property: "og:title", content: "Ausculta pulmonar — medscuta" },
      { property: "og:description", content: "Treine a ausculta pulmonar." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <Ausculta titulo="Pulmonar" pontos={pontosPulmonares} />,
});
