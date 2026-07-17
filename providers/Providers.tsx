"use client";

import { ReactNode } from "react";
import { QueryProvider } from "./QueryProvider";
import { ReduxProvider } from "./ReduxProvider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <ReduxProvider>
        {children}
      </ReduxProvider>
    </QueryProvider>
  );
}