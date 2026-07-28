/*
 * Copyright (c) 2026 Edwin Oswaldo Castillo Trejo. TAMV Online Network
 * SPDX-License-Identifier: MIT
 */
import { ReactNode } from "react";
import { RDMNavbar } from "./RDMNavbar";
import { RDMFooter } from "./RDMFooter";
import "@/styles/rdm-theme.css";

interface RDMLayoutProps {
  children: ReactNode;
  hideNav?: boolean;
  hideFooter?: boolean;
}

export function RDMLayout({ children, hideNav, hideFooter }: RDMLayoutProps) {
  return (
    <div className="rdm-theme min-h-screen flex flex-col">
      {!hideNav && <RDMNavbar />}
      <main className="flex-1">{children}</main>
      {!hideFooter && <RDMFooter />}
    </div>
  );
}
