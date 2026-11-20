import { Link } from "@tanstack/react-router";
import { BookCover } from "./book-cover";
import type { Book } from "@/lib/books";
import { cn } from "@/lib/utils";

export type ShelfItem = { book: Book; to: "listing" | "library"; listingId?: string };

/** A wooden shelf with books standing face-out so every cover is clearly visible. */
export function Shelf({ items, className }: { items: ShelfItem[]; className?: string }) {
  return (
    <div className={cn("relative", className)}>
      <div className="grid grid-cols-4 items-end gap-3 px-2 sm:gap-4">
        {items.map((item) => {
          const { book } = item;
          const inner = (
            <>
              <BookCover
                src={book.cover}
                title={book.title}
                author={book.author}
                className="w-full transition-transform duration-300 group-hover:-translate-y-3 group-hover:scale-[1.04]"
              />
              <span className="mt-2 block truncate text-center font-mono text-[0.6rem] tracking-wider text-gold/90">
                {book.code}
              </span>
            </>
          );
          const cls = "group block min-w-0 focus-visible:outline-none";
          return item.to === "listing" && item.listingId ? (
            <Link
              key={book.id}
              to="/books/$listingId"
              params={{ listingId: item.listingId }}
              className={cls}
              title={book.title}
            >
              {inner}
            </Link>
          ) : (
            <Link
              key={book.id}
              to="/digital-library"
              search={{ q: book.code }}
              className={cls}
              title={book.title}
            >
              {inner}
            </Link>
          );
        })}
      </div>
      <div className="shelf-board -mt-5" />
    </div>
  );
}
