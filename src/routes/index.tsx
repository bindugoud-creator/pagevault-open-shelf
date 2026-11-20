import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  BookMarked,
  BookOpen,
  CloudUpload,
  GraduationCap,
  Handshake,
  History,
  Library,
  Search,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BookCard } from "@/components/site/book-card";
import { SectionHeading } from "@/components/site/section-heading";
import { Shelf, type ShelfItem } from "@/components/site/shelf";
import { BOOKS, BOOKS_BY_ID, FEATURED_LISTING_IDS, SEED_LISTINGS } from "@/lib/books";
import { useAllListings } from "@/lib/store";
import libraryImage from "@/assets/library.webp.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MRV BookHub — Your Campus. Your Books. One Platform." },
      {
        name: "description",
        content:
          "Borrow, exchange and reserve academic books at MRV College. Browse classmates' shelves and reserve Central Library copies online.",
      },
      { property: "og:title", content: "MRV BookHub — Your Campus. Your Books. One Platform." },
      {
        property: "og:description",
        content: "Borrow, exchange and reserve academic books at MRV College — all in one place.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const COMMUNITY_SHELF: ShelfItem[] = [
  "l-os",
  "l-cn",
  "l-ml",
  "l-aima",
  "l-thermo",
  "l-circuits",
  "l-clrs",
  "l-python",
].flatMap((id) => {
  const l = SEED_LISTINGS.find((x) => x.id === id);
  const book = l?.bookId ? BOOKS_BY_ID[l.bookId] : undefined;
  return book && l ? [{ book, to: "listing" as const, listingId: l.id }] : [];
});

const PEEK_SHELF: ShelfItem[] = ["ml", "signals", "thermo", "circuits", "concrete", "dl", "cloud", "crypto"].flatMap(
  (id) => {
    const book = BOOKS_BY_ID[id];
    return book ? [{ book, to: "library" as const }] : [];
  },
);

const STEPS = [
  { icon: CloudUpload, title: "List or reserve", text: "Upload your spare textbooks, or reserve a library copy online in seconds." },
  { icon: Search, title: "Find your book", text: "Filter by department, course code, author, condition and availability." },
  { icon: Handshake, title: "Request & approve", text: "Send a borrow request with your duration — the owner approves in a tap." },
  { icon: GraduationCap, title: "Borrow & return", text: "Meet, hand over, and return by the due date. Reminders keep you on track." },
];

const LIBRARY_FEATURES = [
  { icon: Search, text: "Search the college catalogue by title, author, ISBN or course code" },
  { icon: BookOpen, text: "See live copy counts — total, available, reserved and issued" },
  { icon: BookMarked, text: "Reserve a copy online and get a formal reservation ID instantly" },
  { icon: History, text: "Track your full borrowing history and due dates" },
];

function Home() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const listings = useAllListings();
  const featured = FEATURED_LISTING_IDS.flatMap((id) => listings.filter((l) => l.id === id));
  const recent = listings.slice(0, 4);

  return (
    <>
      {/* Hero */}
      <section className="bg-hero text-cream">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 lg:grid-cols-2 lg:px-8 lg:py-24">
          <div className="animate-fade-up">
            <p className="inline-flex items-center gap-2 rounded-full bg-espresso-soft/70 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-gold">
              <Sparkles className="size-3" /> MRV College · Book Exchange & Digital Library
            </p>
            <h1 className="mt-6 text-5xl font-bold leading-[1.05] sm:text-6xl">
              Your Campus.
              <br />
              Your Books.
              <br />
              <em className="text-blush">One Platform.</em>
            </h1>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-cream/80">
              Search, upload, borrow, exchange and reserve academic books — from classmates'
              shelves to the college digital library, all in one premium platform for MRV
              students, faculty and librarians.
            </p>

            <form
              className="mt-8 flex max-w-lg items-center gap-2 rounded-full bg-cream p-1.5 pl-5 shadow-xl"
              onSubmit={(e) => {
                e.preventDefault();
                void navigate({ to: "/browse", search: q.trim() ? { q: q.trim() } : {} });
              }}
            >
              <Search className="size-5 shrink-0 text-primary" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by title, author, ISBN or course code…"
                className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                aria-label="Search books"
              />
              <Button type="submit" variant="hero" size="sm" className="h-9 px-5">
                Search
              </Button>
            </form>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button variant="hero" asChild>
                <Link to="/browse">
                  <BookOpen /> Browse Books
                </Link>
              </Button>
              <Button variant="onDark" asChild>
                <Link to="/digital-library">
                  <Library /> Digital Library
                </Link>
              </Button>
            </div>

            <dl className="mt-10 flex gap-10">
              {[
                [`${BOOKS.length}+`, "Academic titles"],
                ["5", "Roles supported"],
                ["48h", "Reservation pickup"],
              ].map(([n, l]) => (
                <div key={l}>
                  <dt className="font-heading text-2xl font-bold">{n}</dt>
                  <dd className="text-xs uppercase tracking-wider text-cream/60">{l}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="animate-fade-up rounded-3xl border border-cream/10 bg-espresso-soft/40 p-8 shadow-2xl [animation-delay:150ms]">
            <div className="flex items-center justify-between">
              <p className="font-heading text-sm font-bold uppercase tracking-[0.25em] text-gold">
                The Community Shelf
              </p>
              <p className="font-mono text-[0.65rem] text-cream/50">tap a cover to open it</p>
            </div>
            <Shelf items={COMMUNITY_SHELF.slice(0, 4)} className="mt-6" />
            <Shelf items={COMMUNITY_SHELF.slice(4, 8)} className="mt-8" />
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <SectionHeading
          eyebrow="Community picks"
          title="Featured Books"
          action={
            <Link to="/browse" className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
              View all <ArrowRight className="size-4" />
            </Link>
          }
        />
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((l) => (
            <BookCard key={l.id} listing={l} />
          ))}
        </div>
      </section>

      {/* Recent */}
      <section className="bg-secondary">
        <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
          <SectionHeading
            eyebrow="Fresh on the shelf"
            title="Recently Uploaded"
            action={
              <Button variant="outline" size="sm" className="rounded-full" asChild>
                <Link to="/upload">
                  <CloudUpload /> Upload your book
                </Link>
              </Button>
            }
          />
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {recent.map((l) => (
              <BookCard key={l.id} listing={l} />
            ))}
          </div>
        </div>
      </section>

      {/* Digital library */}
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 lg:grid-cols-2 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl shadow-card-hover">
          <img
            src={libraryImage.url}
            alt="Mahogany shelves and reading tables in the MRV Central Library"
            className="aspect-[4/3] w-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-image-fade" />
          <div className="absolute inset-x-0 bottom-0 p-7">
            <p className="font-mono text-[0.65rem] uppercase tracking-[0.3em] text-gold">
              MRV Central Library
            </p>
            <p className="mt-2 font-heading text-2xl font-bold text-cream">
              Reserve online. Collect at the counter.
            </p>
          </div>
        </div>

        <div>
          <SectionHeading eyebrow="Digital Library" title="The whole library, one click away" />
          <ul className="mt-6 space-y-4">
            {LIBRARY_FEATURES.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-start gap-3">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
                  <Icon className="size-4" />
                </span>
                <span className="pt-1 text-sm text-foreground/85">{text}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8 rounded-3xl bg-espresso p-6 pb-5 shadow-card-hover">
            <p className="font-heading text-sm font-bold uppercase tracking-[0.25em] text-gold">
              Peek at the shelves
            </p>
            <Shelf items={PEEK_SHELF.slice(0, 4)} className="mt-5" />
          </div>

          <Button variant="hero" className="mt-6" asChild>
            <Link to="/digital-library">
              Enter the Digital Library <ArrowRight />
            </Link>
          </Button>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="scroll-mt-16 bg-espresso">
        <div className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
          <SectionHeading eyebrow="Simple by design" title="How It Works" tone="dark" align="center" />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map(({ icon: Icon, title, text }, i) => (
              <div
                key={title}
                className="rounded-2xl border border-cream/10 bg-espresso-soft/40 p-6 transition-colors hover:bg-espresso-soft/70"
              >
                <div className="flex items-center justify-between">
                  <span className="flex size-11 items-center justify-center rounded-xl bg-primary text-cream">
                    <Icon className="size-5" />
                  </span>
                  <span className="font-heading text-2xl font-bold text-primary">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-6 text-lg font-bold text-cream">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-cream/65">{text}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 flex flex-wrap justify-center gap-3">
            <Button variant="blush" size="xl" asChild>
              <Link to="/register">Create your free account</Link>
            </Button>
            <Button variant="onDarkOutline" size="xl" asChild>
              <Link to="/about">Read the FAQ</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
