"use client";

import { cn } from "@/lib/utils";
import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

export function ScrollToTopButton() {
	const [isVisible, setIsVisible] = useState(false);
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setMounted(true);
	}, []);

	useEffect(() => {
		if (!mounted) return;

		const toggleVisibility = () => {
			if (window.scrollY > 300) {
				setIsVisible(true);
			} else {
				setIsVisible(false);
			}
		};

		// Run initially in case page is already scrolled on mount
		toggleVisibility();

		window.addEventListener("scroll", toggleVisibility);
		return () => {
			window.removeEventListener("scroll", toggleVisibility);
		};
	}, [mounted]);

	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	};

	if (!mounted) return null;

	return (
		<button
			onClick={scrollToTop}
			className={cn(
				"fixed bottom-6 right-6 z-40 p-3 rounded-full border border-hairline bg-canvas/90 hover:bg-canvas text-ink shadow-level-3 hover:shadow-level-4 transition-all duration-300 transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer backdrop-blur",
				isVisible
					? "opacity-100 translate-y-0 pointer-events-auto"
					: "opacity-0 translate-y-4 pointer-events-none"
			)}
			title="Scroll to Top"
			aria-label="Scroll to top of the page"
		>
			<ArrowUp className="h-5 w-5" />
		</button>
	);
}
