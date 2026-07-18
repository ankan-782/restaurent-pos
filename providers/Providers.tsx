"use client";

import { ReactNode } from "react";
import { QueryProvider } from "./QueryProvider";
import { ReduxProvider } from "./ReduxProvider";
import { ThemeProvider } from "./ThemeProvider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <QueryProvider>
        <ReduxProvider>
          {children}
        </ReduxProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}