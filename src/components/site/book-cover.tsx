import { useState } from "react";
import { cn } from "@/lib/utils";

type Props = {
  src?: string | undefined;
  title: string;
  author?: string;
  className?: string;
};

/** A book's front cover — the real cover photo, or a cloth-bound fallback with the title. */
export function BookCover({ src, title, author, className }: Props) {
  const [failed, setFailed] = useState(false);
  const showImage = src && !failed;

  return (
    <div
      className={cn(
        "relative aspect-[3/4] overflow-hidden rounded-[3px] bg-espresso-soft shadow-book",
        className,
      )}
    >
      {showImage ? (
        <img
          src={src}
          alt={`Cover of ${title}`}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full flex-col justify-between bg-gradient-to-br from-spine-2 to-spine-4 p-[10%] text-cream">
          <span className="h-px w-1/2 bg-gold/60" />
          <div>
            <p className="font-heading text-[clamp(0.6rem,1.4vw,1rem)] font-bold leading-tight">
              {title}
            </p>
            {author && (
              <p className="mt-1 text-[clamp(0.45rem,0.9vw,0.7rem)] uppercase tracking-wider text-cream/70">
                {author}
              </p>
            )}
          </div>
          <span className="h-px w-1/3 bg-gold/60" />
        </div>
      )}
      {/* spine crease */}
      <span className="pointer-events-none absolute inset-y-0 left-0 w-[6%] bg-gradient-to-r from-espresso-deep/35 to-transparent" />
    </div>
  );
}
