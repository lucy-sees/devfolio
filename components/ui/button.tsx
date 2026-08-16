import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { buttonTap } from "@/lib/motion";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden cursor-pointer select-none",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-primary to-secondary text-primary-foreground glow-primary",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        secondary: "bg-secondary/15 text-secondary border border-secondary/30 hover:bg-secondary/25 hover:border-secondary/50",
        ghost: "hover:bg-primary/10 text-primary",
        link: "text-primary underline-offset-4 hover:underline",
        outline: "border-2 border-primary bg-transparent text-primary hover:bg-primary/10 focus:outline focus:outline-2 focus:outline-secondary",
        mint: "bg-mint/15 text-mint border border-mint/30 hover:bg-mint/25 hover:border-mint/50",
        gold: "bg-gold/15 text-gold border border-gold/30 hover:bg-gold/25 hover:border-gold/50",
      },
      size: {
        default: "h-12 px-6 py-4 rounded-lg",
        sm: "h-10 px-5 py-3 rounded-md",
        lg: "h-14 px-8 py-5 rounded-xl",
        icon: "h-12 w-12 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends Omit<HTMLMotionProps<"button">, "onDrag" | "onDragEnd" | "onDragStart">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  type?: "button" | "submit" | "reset";
  /** Skip the built-in hover/tap scale animation (e.g. when a parent already animates it). */
  enableMotion?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, asChild = false, type = "button", enableMotion = true, children, ...props },
    ref
  ) => {
    if (asChild) {
      return (
        <Slot ref={ref} className={cn(buttonVariants({ variant, size, className }))} {...(props as any)}>
          {children}
        </Slot>
      );
    }

    const motionProps = enableMotion ? buttonTap : {};

    return (
      <motion.button
        ref={ref}
        type={type}
        className={cn(buttonVariants({ variant, size, className }))}
        {...motionProps}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
