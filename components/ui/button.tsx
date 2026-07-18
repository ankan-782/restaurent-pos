import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer h-11 px-sm",
  {
    variants: {
      variant: {
        default: "bg-primary text-on-primary hover:opacity-90",
        destructive: "bg-error text-on-primary hover:bg-error-deep",
        outline: "border border-hairline bg-canvas hover:bg-canvas-soft",
        secondary: "bg-canvas text-ink border border-hairline hover:bg-canvas-soft",
        ghost: "hover:bg-canvas-soft",
        link: "text-link underline-offset-2 hover:underline",
      },
      size: {
        default: "h-11 px-sm text-sm",
        sm: "h-8 px-xs text-[13px]",
        lg: "h-14 px-md text-base",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };