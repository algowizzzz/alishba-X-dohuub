import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        // DoHuub: solid blue with soft blue glow shadow on default
        default: "bg-[#2E7AD9] text-white hover:bg-[#1E5DB0] shadow-[0_4px_12px_rgba(46,122,217,0.25)]",
        destructive:
          "bg-[#DC2626] text-white hover:bg-[#B91C1C] shadow-[0_4px_12px_rgba(220,38,38,0.25)]",
        outline:
          "border border-[#2E7AD9] bg-white text-[#2E7AD9] hover:bg-[rgba(46,122,217,0.08)]",
        secondary:
          "bg-[rgba(46,122,217,0.08)] text-[#2E7AD9] hover:bg-[rgba(46,122,217,0.15)]",
        ghost:
          "text-[#1A1A2E] hover:bg-[rgba(46,122,217,0.08)] hover:text-[#2E7AD9]",
        link: "text-[#2E7AD9] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

const Button = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> &
    VariantProps<typeof buttonVariants> & {
      asChild?: boolean;
    }
>(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  );
});
Button.displayName = "Button";

export { Button, buttonVariants };