import { Link } from "@tanstack/react-router";
import { BookOpen, Eye, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BookCover } from "./book-cover";
import { Chip } from "./chip";
import { RequestButton } from "./request-dialog";
import { OFFERS, type Listing } from "@/lib/books";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

export function BookCard({ listing, className }: { listing: Listing; className?: string }) {
  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border bg-card shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover",
        className,
      )}
    >
      <Link
        to="/books/$listingId"
        params={{ listingId: listing.id }}
        className="block bg-cover-panel px-8 pb-6 pt-8"
        aria-label={`View ${listing.title}`}
      >
        <BookCover
          src={listing.cover}
          title={listing.title}
          author={listing.author}
          className="mx-auto w-full max-w-[210px] transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </Link>

      <div className="flex flex-1 flex-col p-4 pt-4">
        <div className="flex items-center justify-between gap-2">
          <Chip variant="code" className="bg-espresso">
            {listing.code}
          </Chip>
          <Chip variant="dark">
            {listing.offer === "sale" ? <Tag className="size-3" /> : <BookOpen className="size-3" />}
            {OFFERS[listing.offer]}
          </Chip>
        </div>
        <Link to="/books/$listingId" params={{ listingId: listing.id }} className="mt-3">
          <h3 className="font-heading text-lg font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
            {listing.title}
          </h3>
        </Link>
        <p className="mt-0.5 text-sm text-muted-foreground">{listing.author}</p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          <Chip variant="neutral">{listing.condition}</Chip>
          {listing.available ? (
            <Chip variant="success">Available</Chip>
          ) : (
            <Chip variant="danger">Unavailable</Chip>
          )}
          <Chip variant="outline">{listing.edition} ed.</Chip>
          {listing.price !== undefined && <Chip variant="blush">{formatPrice(listing.price)}</Chip>}
        </div>

        <div className="mt-auto grid grid-cols-2 gap-2 pt-5">
          <Button variant="soft" size="sm" asChild>
            <Link to="/books/$listingId" params={{ listingId: listing.id }}>
              <Eye />
              Details
            </Link>
          </Button>
          <RequestButton listing={listing} size="sm" />
        </div>
      </div>
    </article>
  );
}
