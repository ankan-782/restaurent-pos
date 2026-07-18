"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextProps {
	theme: Theme;
	toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export function ThemeProvider({
	children,
	initialTheme,
}: {
	children: React.ReactNode;
	initialTheme: Theme;
}) {
	const [theme, setTheme] = useState<Theme>(initialTheme);

	useEffect(() => {
		// Only fires for a brand-new visitor with no theme cookie yet —
		// syncs to their system preference and stores it for next time.
		const hasCookie = document.cookie.includes("theme=");
		if (!hasCookie) {
			const systemTheme = window.matchMedia(
				"(prefers-color-scheme: dark)",
			).matches
				? "dark"
				: "light";
			if (systemTheme !== theme) {
				// eslint-disable-next-line react-hooks/set-state-in-effect
				setTheme(systemTheme);
				document.documentElement.classList.toggle(
					"dark",
					systemTheme === "dark",
				);
			}
			document.cookie = `theme=${systemTheme}; path=/; max-age=31536000`;
		}
	}, []);

	const toggleTheme = () => {
		const nextTheme = theme === "light" ? "dark" : "light";
		setTheme(nextTheme);
		document.cookie = `theme=${nextTheme}; path=/; max-age=31536000`;
		document.documentElement.classList.toggle("dark", nextTheme === "dark");
	};

	return (
		<ThemeContext.Provider value={{ theme, toggleTheme }}>
			{children}
		</ThemeContext.Provider>
	);
}

export function useTheme() {
	const context = useContext(ThemeContext);
	if (context === undefined) {
		throw new Error("useTheme must be used within a ThemeProvider");
	}
	return context;
}
