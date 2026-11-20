import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const chipVariants = cva(
  "inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-0.5 text-[0.7rem] font-medium leading-5",
  {
    variants: {
      variant: {
        neutral: "border border-border bg-secondary text-foreground",
        outline: "border border-border bg-card text-muted-foreground",
        success: "bg-success text-success-foreground",
        warning: "bg-warning text-warning-foreground",
        danger: "bg-danger-soft text-danger-soft-foreground",
        dark: "bg-espresso text-cream shadow-sm",
        code: "rounded-md bg-espresso/75 font-mono text-[0.65rem] tracking-wider text-cream backdrop-blur",
        blush: "bg-blush/30 text-espresso",
      },
    },
    defaultVariants: { variant: "neutral" },
  },
);

export function Chip({
  className,
  variant,
  ...props
}: HTMLAttributes<HTMLSpanElement> & VariantProps<typeof chipVariants>) {
  return <span className={cn(chipVariants({ variant }), className)} {...props} />;
}
