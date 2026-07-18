"use client";

import { ToastProvider } from "@/components/ui/Toast";
import { ReactNode } from "react";
import { QueryProvider } from "./QueryProvider";
import { ReduxProvider } from "./ReduxProvider";
import { ThemeProvider } from "./ThemeProvider";

export function Providers({
	children,
	initialTheme,
}: {
	children: ReactNode;
	initialTheme: "light" | "dark";
}) {
	return (
		<ThemeProvider initialTheme={initialTheme}>
			<QueryProvider>
				<ReduxProvider>
					<ToastProvider>{children}</ToastProvider>
				</ReduxProvider>
			</QueryProvider>
		</ThemeProvider>
	);
}
