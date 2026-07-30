"use client";

import { type ReactNode } from "react";
import { QueryProvider } from "@/providers/query-provider";
import { AuthProvider } from "@/providers/auth-provider";
import { Toaster } from "sonner";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <AuthProvider>
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#121418",
              color: "#e8e6e0",
              border: "1px solid #2a2d35",
            },
          }}
        />
      </AuthProvider>
    </QueryProvider>
  );
}
