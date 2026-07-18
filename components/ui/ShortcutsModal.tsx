"use client";

import { Keyboard, X } from "lucide-react";

interface ShortcutsModalProps {
	isOpen: boolean;
	onClose: () => void;
}

export function ShortcutsModal({ isOpen, onClose }: ShortcutsModalProps) {
	if (!isOpen) return null;

	const shortcuts = [
		{ keys: ["S", "/"], desc: "Focus product search input" },
		{ keys: ["C"], desc: "Navigate to Shopping Cart" },
		{ keys: ["H"], desc: "Navigate to Products Grid (Home)" },
		{ keys: ["W"], desc: "Navigate to Wishlist page" },
		{ keys: ["?"], desc: "Toggle this keyboard shortcuts dialog" },
		{ keys: ["Esc"], desc: "Close checkout modal / notifications" },
	];

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
			<div className="bg-canvas rounded-xl shadow-level-5 w-full max-w-[28rem] overflow-hidden border border-hairline animate-scale-in">
				{/* Header */}
				<div className="flex items-center justify-between px-5 py-4 border-b border-hairline bg-canvas-soft">
					<div className="flex items-center gap-2 text-ink">
						<Keyboard className="h-5 w-5" />
						<h3 className="text-body-md-strong font-semibold">
							Keyboard Shortcuts
						</h3>
					</div>
					<button
						onClick={onClose}
						className="p-1.5 rounded-md text-mute hover:text-ink hover:bg-canvas-soft-2 transition-colors cursor-pointer"
						aria-label="Close dialog"
					>
						<X className="h-4.5 w-4.5" />
					</button>
				</div>

				{/* Content */}
				<div className="p-5 space-y-4">
					<p className="text-body-sm text-body">
						Press any of the following keys when you are not typing
						in a search box:
					</p>

					<div className="space-y-3">
						{shortcuts.map((shortcut, index) => (
							<div
								key={index}
								className="flex items-center justify-between py-2 border-b border-hairline last:border-0"
							>
								<span className="text-body-sm text-body">
									{shortcut.desc}
								</span>
								<div className="flex items-center gap-1">
									{shortcut.keys.map((key, keyIndex) => (
										<span
											key={keyIndex}
											className="inline-flex items-center justify-center min-w-6 h-6 px-1.5 text-xs font-semibold font-mono bg-canvas-soft-2 border border-hairline-strong rounded-sm text-ink"
										>
											{key}
										</span>
									))}
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
