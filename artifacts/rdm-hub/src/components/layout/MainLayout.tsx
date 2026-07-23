import { ReactNode } from "react";
import { RDMLayout } from "@/components/rdm/RDMLayout";
import { RealitoOrb } from "@/components/RealitoOrb";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <RDMLayout>
      {children}
      <RealitoOrb />
    </RDMLayout>
  );
}
