import { BookMarked } from "lucide-react";
import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent shadow-md",
        className,
      )}
    >
      <BookMarked className="size-5 text-cream" aria-hidden />
    </span>
  );
}
