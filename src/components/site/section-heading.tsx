import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  action,
  tone = "light",
  align = "left",
  className,
}: {
  eyebrow: string;
  title: string;
  action?: ReactNode;
  tone?: "light" | "dark";
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-end justify-between gap-4",
        align === "center" && "flex-col items-center text-center",
        className,
      )}
    >
      <div>
        <p className={cn("eyebrow", tone === "dark" ? "text-accent" : "text-primary")}>{eyebrow}</p>
        <h2
          className={cn(
            "mt-1 text-3xl font-bold sm:text-4xl",
            tone === "dark" ? "text-cream" : "text-foreground",
          )}
        >
          {title}
        </h2>
      </div>
      {action}
    </div>
  );
}
