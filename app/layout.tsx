import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { UndoToast } from "@/components/ui/UndoToast";
import { Providers } from "@/providers/Providers";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";

const geistSans = Geist({
	variable: "--font-sans",
	subsets: ["latin"],
	weight: ["400", "500", "600"],
	display: "swap",
});

const geistMono = Geist_Mono({
	variable: "--font-mono",
	subsets: ["latin"],
	weight: "400",
	display: "swap",
});

const inter = Inter({
	variable: "--font-sans",
	subsets: ["latin"],
	weight: ["400", "500", "600"],
	display: "swap",
});

export const metadata: Metadata = {
	title: "Restaurant POS - New Order",
	description: "Restaurant Point of Sale - New Order Module",
};

export const viewport: Viewport = {
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "#fafafa" },
		{ media: "(prefers-color-scheme: dark)", color: "#171717" },
	],
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const cookieStore = await cookies();
	const theme = cookieStore.get("theme")?.value === "dark" ? "dark" : "light";

	return (
		<html
			lang="en"
			className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${theme === "dark" ? "dark" : ""}`}
		>
			<body className="font-sans antialiased flex flex-col transition-colors">
				<Providers initialTheme={theme}>
					<Header />
					{children}
					<Footer />
					<UndoToast />
				</Providers>
			</body>
		</html>
	);
}
