import { ScrollToTopButton } from "@/components/ui/ScrollToTopButton";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeAll, describe, expect, it, vi } from "vitest";

describe("ScrollToTopButton", () => {
	beforeAll(() => {
		// Mock window.scrollTo since jsdom doesn't implement layout-based scrolling
		window.scrollTo = vi.fn();
	});

	it("should render and be hidden initially", () => {
		render(<ScrollToTopButton />);
		const button = screen.getByRole("button", { name: /scroll to top/i });
		expect(button).toBeDefined();
		expect(button.className).toContain("opacity-0");
		expect(button.className).toContain("pointer-events-none");
	});

	it("should become visible when scrolling down past 300px", () => {
		render(<ScrollToTopButton />);
		
		// Change scroll Y and fire event
		Object.defineProperty(window, "scrollY", { value: 400, writable: true });
		fireEvent.scroll(window);

		const button = screen.getByRole("button", { name: /scroll to top/i });
		expect(button.className).toContain("opacity-100");
		expect(button.className).toContain("pointer-events-auto");
	});

	it("should hide again when scrolling back up", () => {
		render(<ScrollToTopButton />);
		
		// Scroll down
		Object.defineProperty(window, "scrollY", { value: 400, writable: true });
		fireEvent.scroll(window);
		const button = screen.getByRole("button", { name: /scroll to top/i });
		expect(button.className).toContain("opacity-100");

		// Scroll up
		Object.defineProperty(window, "scrollY", { value: 100, writable: true });
		fireEvent.scroll(window);
		expect(button.className).toContain("opacity-0");
	});

	it("should smooth scroll to top when clicked", () => {
		render(<ScrollToTopButton />);
		
		// Scroll down to make active
		Object.defineProperty(window, "scrollY", { value: 400, writable: true });
		fireEvent.scroll(window);

		const button = screen.getByRole("button", { name: /scroll to top/i });
		fireEvent.click(button);

		expect(window.scrollTo).toHaveBeenCalledWith({
			top: 0,
			behavior: "smooth",
		});
	});
});
