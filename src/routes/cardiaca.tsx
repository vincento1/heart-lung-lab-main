import { createFileRoute } from "@tanstack/react-router";
import { AuscultaCardiaca } from "@/components/AuscultaCardiaca";

export const Route = createFileRoute("/cardiaca")({
  head: () => ({
    meta: [
      { title: "Ausculta cardíaca — medscuta" },
      { name: "description", content: "Treine os focos e sons da ausculta cardíaca." },
      { property: "og:title", content: "Ausculta cardíaca — medscuta" },
      { property: "og:description", content: "Treine os focos e sons da ausculta cardíaca." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuscultaCardiaca,
});
