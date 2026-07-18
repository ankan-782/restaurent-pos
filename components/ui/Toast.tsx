"use client";

import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle, Info, X } from "lucide-react";
import React, {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";

export interface ToastMessage {
	id: string;
	message: string;
	type: "success" | "error" | "info";
	title?: string;
	duration?: number;
}

interface ToastContextType {
	toast: (
		message: string,
		type?: "success" | "error" | "info",
		title?: string,
		duration?: number,
	) => void;
	success: (message: string, title?: string, duration?: number) => void;
	error: (message: string, title?: string, duration?: number) => void;
	info: (message: string, title?: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
	const [toasts, setToasts] = useState<ToastMessage[]>([]);

	const addToast = useCallback(
		(
			message: string,
			type: "success" | "error" | "info" = "info",
			title?: string,
			duration = 4000,
		) => {
			const id = Math.random().toString(36).substring(2, 9);
			setToasts((prev) => [
				...prev,
				{ id, message, type, title, duration },
			]);
		},
		[],
	);

	const removeToast = useCallback((id: string) => {
		setToasts((prev) => prev.filter((t) => t.id !== id));
	}, []);

	const success = useCallback(
		(message: string, title?: string, duration?: number) => {
			addToast(message, "success", title || "Success", duration);
		},
		[addToast],
	);

	const error = useCallback(
		(message: string, title?: string, duration?: number) => {
			addToast(message, "error", title || "Error", duration);
		},
		[addToast],
	);

	const info = useCallback(
		(message: string, title?: string, duration?: number) => {
			addToast(message, "info", title || "Info", duration);
		},
		[addToast],
	);

	return (
		<ToastContext.Provider
			value={{ toast: addToast, success, error, info }}
		>
			{children}
			<div className="fixed top-5 right-5 z-100 flex flex-col gap-3 w-full max-w-96 pointer-events-none">
				{toasts.map((t) => (
					<ToastItem
						key={t.id}
						toast={t}
						onClose={() => removeToast(t.id)}
					/>
				))}
			</div>
		</ToastContext.Provider>
	);
}

export function useToast() {
	const context = useContext(ToastContext);
	if (!context) {
		throw new Error("useToast must be used within a ToastProvider");
	}
	return context;
}

function ToastItem({
	toast,
	onClose,
}: {
	toast: ToastMessage;
	onClose: () => void;
}) {
	const [mounted, setMounted] = useState(false);
	const { message, type, title, duration = 4000 } = toast;

	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setMounted(true);
		const timer = setTimeout(() => {
			onClose();
		}, duration);
		return () => clearTimeout(timer);
	}, [onClose, duration]);

	const Icon = {
		success: CheckCircle,
		error: AlertCircle,
		info: Info,
	}[type];

	const colors = {
		success: {
			border: "border-success",
			icon: "text-success",
			bg: "bg-canvas border-hairline border-l-4 border-l-success",
			progress: "bg-success",
		},
		error: {
			border: "border-error",
			icon: "text-error",
			bg: "bg-canvas border-hairline border-l-4 border-l-error",
			progress: "bg-error",
		},
		info: {
			border: "border-primary",
			icon: "text-primary",
			bg: "bg-canvas border-hairline border-l-4 border-l-primary",
			progress: "bg-primary",
		},
	}[type];

	return (
		<div
			className={cn(
				"pointer-events-auto relative overflow-hidden rounded-lg shadow-level-4 border flex gap-3 p-4 w-full transition-all duration-300 transform",
				mounted
					? "animate-slide-up opacity-100 translate-y-0"
					: "opacity-0 translate-y-2",
				colors.bg,
			)}
			role="alert"
		>
			<div className="shrink-0">
				<Icon className={cn("h-5 w-5", colors.icon)} />
			</div>

			<div className="flex-1 min-w-0">
				{title && (
					<p className="text-body-sm-strong font-semibold text-ink mb-0.5">
						{title}
					</p>
				)}
				<p className="text-body-sm text-body leading-relaxed">
					{message}
				</p>
			</div>

			<div className="shrink-0">
				<button
					onClick={onClose}
					className="text-mute hover:text-ink p-0.5 rounded-md hover:bg-canvas-soft-2 transition-colors cursor-pointer"
					aria-label="Close notification"
				>
					<X className="h-4 w-4" />
				</button>
			</div>

			{/* Progress Bar */}
			<div className="absolute bottom-0 left-0 right-0 h-0.5 bg-canvas-soft-2 overflow-hidden">
				<div
					className={cn("h-full", colors.progress)}
					style={{
						animation: `shrink-progress ${duration}ms linear forwards`,
					}}
				/>
			</div>
		</div>
	);
}
