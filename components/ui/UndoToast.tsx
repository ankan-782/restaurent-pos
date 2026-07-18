"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import {
	clearLastRemovedItem,
	selectLastRemovedItem,
	undoRemove,
} from "@/store/cartSlice";
import { Undo2, X } from "lucide-react";
import { useEffect } from "react";

export function UndoToast() {
	const dispatch = useAppDispatch();
	const lastRemovedItem = useAppSelector(selectLastRemovedItem);

	useEffect(() => {
		if (lastRemovedItem) {
			const timer = setTimeout(() => {
				dispatch(clearLastRemovedItem());
			}, 5000);
			return () => clearTimeout(timer);
		}
	}, [lastRemovedItem, dispatch]);

	const handleUndo = () => {
		dispatch(undoRemove());
	};

	const handleDismiss = () => {
		dispatch(clearLastRemovedItem());
	};

	if (!lastRemovedItem) return null;

	return (
		<div className="fixed bottom-5 right-5 z-50 flex items-center justify-between gap-4 bg-canvas text-ink px-4 py-3 rounded-lg shadow-level-4 animate-slide-up border border-hairline w-full max-w-96">
			<div className="flex-1 min-w-0">
				<p className="text-body-sm-strong font-medium truncate">
					Removed {lastRemovedItem.product.title}
				</p>
			</div>

			<div className="flex items-center gap-2.5">
				<button
					onClick={handleUndo}
					className="flex items-center gap-1.5 bg-primary text-on-primary px-2.5 py-1 text-button-sm rounded-md font-medium hover:opacity-90 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
				>
					<Undo2 className="h-3.5 w-3.5" />
					Undo
				</button>

				<button
					onClick={handleDismiss}
					className="text-mute hover:text-ink p-1 rounded-md hover:bg-canvas-soft-2 transition-colors cursor-pointer"
					aria-label="Dismiss toast"
				>
					<X className="h-4 w-4" />
				</button>
			</div>
		</div>
	);
}
