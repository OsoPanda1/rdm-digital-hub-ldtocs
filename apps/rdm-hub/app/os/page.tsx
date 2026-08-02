import type { Metadata } from "next";
import OsApp from "../../os/App";

export const metadata: Metadata = {
  title: "RDM Digital OS — Nodo Cero Real del Monte",
  description:
    "Sistema operativo territorial de Real del Monte: turismo, comercio, foros, membresías, tienda, ISABELLA AI y kernel TAMV en una sola consola soberana.",
  openGraph: {
    title: "RDM Digital OS — Nodo Cero Real del Monte",
    description:
      "Consola unificada del Nodo Cero: turismo, economía ética, gobernanza y kernel TAMV.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "RDM Digital OS — Nodo Cero Real del Monte",
    description: "Consola unificada del Nodo Cero territorial de Real del Monte.",
  },
};

export default function OsPage() {
  return <OsApp />;
}
