"use client";

import { ToastProvider } from "@/components/ui/Toast";
import { ReactNode } from "react";
import { QueryProvider } from "./QueryProvider";
import { ReduxProvider } from "./ReduxProvider";
import { ThemeProvider } from "./ThemeProvider";

export function Providers({ children }: { children: ReactNode }) {
	return (
		<ThemeProvider>
			<QueryProvider>
				<ReduxProvider>
					<ToastProvider>{children}</ToastProvider>
				</ReduxProvider>
			</QueryProvider>
		</ThemeProvider>
	);
}
