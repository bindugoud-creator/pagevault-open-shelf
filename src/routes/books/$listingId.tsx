import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, BookOpen, Building2, CalendarDays, Hash, Library, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BookCover } from "@/components/site/book-cover";
import { BookCard } from "@/components/site/book-card";
import { Chip } from "@/components/site/chip";
import { RequestButton } from "@/components/site/request-dialog";
import { ReserveButton } from "@/components/site/reserve-dialog";
import { BOOKS_BY_ID, OFFERS, SEED_LISTINGS } from "@/lib/books";
import { formatPrice, timeAgo } from "@/lib/format";
import { useAllListings, useListing, useLiveCounts } from "@/lib/store";

export const Route = createFileRoute("/books/$listingId")({
  head: ({ params }) => {
    const seed = SEED_LISTINGS.find((l) => l.id === params.listingId);
    const title = seed ? `${seed.title} · MRV BookHub` : "Book details · MRV BookHub";
    const description = seed
      ? `${seed.title} by ${seed.author} — ${OFFERS[seed.offer].toLowerCase()} from ${seed.ownerName} on MRV BookHub.`
      : "See the book's condition, owner and send a borrow request on MRV BookHub.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "book" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: BookDetailPage,
});

function BookDetailPage() {
  const { listingId } = Route.useParams();
  const listing = useListing(listingId);
  const all = useAllListings();
  const book = listing?.bookId ? BOOKS_BY_ID[listing.bookId] : undefined;
  const counts = useLiveCounts(book?.id ?? "");

  if (!listing) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="text-3xl font-bold">This book isn't on the shelf</h1>
        <p className="mt-2 text-muted-foreground">It may have been removed by its owner.</p>
        <Button className="mt-6" asChild>
          <Link to="/browse">Browse all books</Link>
        </Button>
      </div>
    );
  }

  const related = all
    .filter((l) => l.id !== listing.id && l.department === listing.department)
    .slice(0, 4);

  return (
    <div>
      <section className="bg-secondary">
        <div className="mx-auto max-w-6xl px-4 py-10 lg:px-8">
          <Link
            to="/browse"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            <ArrowLeft className="size-4" /> Back to all books
          </Link>

          <div className="mt-6 grid gap-10 md:grid-cols-[320px_1fr] lg:gap-14">
            <div className="mx-auto w-full max-w-[320px]">
              <BookCover
                src={listing.cover}
                title={listing.title}
                author={listing.author}
                className="w-full rounded-md"
              />
            </div>

            <div>
              <div className="flex flex-wrap gap-2">
                <Chip variant="code" className="bg-espresso">{listing.code}</Chip>
                <Chip variant="dark">{OFFERS[listing.offer]}</Chip>
                <Chip variant="neutral">{listing.condition}</Chip>
                {listing.available ? (
                  <Chip variant="success">Available</Chip>
                ) : (
                  <Chip variant="danger">Currently lent out</Chip>
                )}
              </div>
              <h1 className="mt-4 text-4xl font-bold leading-tight sm:text-5xl">{listing.title}</h1>
              <p className="mt-2 text-lg text-muted-foreground">by {listing.author}</p>

              {listing.price !== undefined && (
                <p className="mt-5 font-heading text-3xl font-bold text-primary">
                  {formatPrice(listing.price)}
                  <span className="ml-2 font-sans text-sm font-normal text-muted-foreground">
                    {listing.offer === "sale" ? "to buy" : "to buy · or borrow free"}
                  </span>
                </p>
              )}

              {book && <p className="mt-5 max-w-2xl leading-relaxed text-foreground/85">{book.description}</p>}

              <dl className="mt-6 grid max-w-xl grid-cols-2 gap-4 text-sm">
                <Fact icon={BookOpen} label="Edition" value={`${listing.edition} edition`} />
                <Fact icon={Building2} label="Department" value={listing.department} />
                {book && <Fact icon={Hash} label="Publisher" value={`${book.publisher}, ${book.year}`} />}
                <Fact icon={CalendarDays} label="Listed" value={timeAgo(listing.createdAt)} />
              </dl>

              <div className="mt-6 flex items-center gap-3 rounded-2xl border bg-card p-4 shadow-card">
                <span className="flex size-11 items-center justify-center rounded-full bg-blush font-semibold text-espresso">
                  {listing.ownerName.charAt(0)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-1.5 font-semibold">
                    <User className="size-4 text-primary" /> {listing.ownerName}
                  </p>
                  <p className="text-sm text-muted-foreground">{listing.ownerInfo}</p>
                </div>
              </div>

              {listing.notes && (
                <blockquote className="mt-4 border-l-2 border-accent pl-4 text-sm italic text-muted-foreground">
                  “{listing.notes}”
                </blockquote>
              )}

              <div className="mt-8 flex flex-wrap gap-3">
                <RequestButton listing={listing} label="Request this book" size="lg" />
                {book && (
                  <ReserveButton
                    book={book}
                    label={`Reserve from library (${counts?.available ?? 0} free)`}
                    variant="outline"
                    size="lg"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-14 lg:px-8">
          <h2 className="text-2xl font-bold">More from {listing.department}</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((l) => (
              <BookCard key={l.id} listing={l} />
            ))}
          </div>
        </section>
      )}

      {!book && (
        <section className="mx-auto max-w-7xl px-4 pb-14 lg:px-8">
          <Button variant="outline" asChild>
            <Link to="/digital-library">
              <Library /> Search the Central Library
            </Link>
          </Button>
        </section>
      )}
    </div>
  );
}

function Fact({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof BookOpen;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="mt-0.5 size-4 text-primary" />
      <div>
        <dt className="text-xs uppercase tracking-wider text-muted-foreground">{label}</dt>
        <dd className="font-medium">{value}</dd>
      </div>
    </div>
  );
}
