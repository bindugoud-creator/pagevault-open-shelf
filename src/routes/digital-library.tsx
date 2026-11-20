import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { MapPin, Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BookCover } from "@/components/site/book-cover";
import { Chip } from "@/components/site/chip";
import { ReserveButton } from "@/components/site/reserve-dialog";
import { BOOKS, DEPARTMENTS, LIBRARY_BY_ID, type Book } from "@/lib/books";
import { PICKUP_WINDOW_HOURS, LOAN_DAYS } from "@/lib/library";
import { useLiveCounts } from "@/lib/store";

type LibrarySearch = { q?: string; dept?: string };

export const Route = createFileRoute("/digital-library")({
  validateSearch: (s: Record<string, unknown>): LibrarySearch => {
    const out: LibrarySearch = {};
    if (typeof s["q"] === "string" && s["q"]) out.q = s["q"];
    if (typeof s["dept"] === "string" && s["dept"]) out.dept = s["dept"];
    return out;
  },
  head: () => ({
    meta: [
      { title: "Digital Library · MRV Central Library catalogue" },
      {
        name: "description",
        content:
          "Search the MRV Central Library catalogue, see live copy counts and reserve a copy online for 48-hour pickup.",
      },
      { property: "og:title", content: "Digital Library · MRV BookHub" },
      {
        property: "og:description",
        content: "Search the catalogue, see live copy counts and reserve a copy online.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LibraryPage,
});

function LibraryPage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/digital-library" });
  const q = (search.q ?? "").toLowerCase();

  const results = BOOKS.filter((b) => {
    if (q && ![b.title, b.author, b.code, b.publisher].some((f) => f.toLowerCase().includes(q)))
      return false;
    if (search.dept && b.department !== search.dept) return false;
    return true;
  });

  const update = (patch: LibrarySearch) =>
    void navigate({
      search: (prev) => {
        const next: LibrarySearch = { ...prev, ...patch };
        if (!next.q) delete next.q;
        if (!next.dept || next.dept === "all") delete next.dept;
        return next;
      },
      replace: true,
    });

  return (
    <div>
      <section className="bg-hero text-cream">
        <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
          <p className="eyebrow text-gold">MRV Central Library</p>
          <h1 className="mt-2 text-4xl font-bold sm:text-5xl">Digital Library</h1>
          <p className="mt-3 max-w-xl text-cream/75">
            Reserve online, collect at the counter within {PICKUP_WINDOW_HOURS} hours. Loans run
            for {LOAN_DAYS} days.
          </p>
          <div className="mt-6 flex max-w-3xl flex-wrap gap-3">
            <div className="flex min-w-[260px] flex-1 items-center gap-2 rounded-full bg-cream p-1.5 pl-5">
              <Search className="size-5 text-primary" />
              <input
                defaultValue={search.q ?? ""}
                key={search.q ?? ""}
                onChange={(e) => update({ q: e.target.value })}
                placeholder="Title, author, publisher or course code…"
                className="min-w-0 flex-1 bg-transparent py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground"
                aria-label="Search the catalogue"
              />
            </div>
            <Select value={search.dept ?? "all"} onValueChange={(v) => update({ dept: v })}>
              <SelectTrigger className="h-12 w-[200px] rounded-full border-cream/20 bg-espresso-soft text-cream">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All departments</SelectItem>
                {DEPARTMENTS.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        <p className="text-sm text-muted-foreground">
          {results.length} {results.length === 1 ? "title" : "titles"} in the catalogue
        </p>
        <div className="mt-4 grid gap-5 md:grid-cols-2">
          {results.map((b) => (
            <LibraryRow key={b.id} book={b} />
          ))}
        </div>
        {results.length === 0 && (
          <div className="mt-6 rounded-2xl border border-dashed p-12 text-center">
            <p className="font-heading text-2xl font-semibold">No titles found</p>
            <p className="mt-2 text-muted-foreground">Try a course code like CS301 or an author name.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function LibraryRow({ book }: { book: Book }) {
  const counts = useLiveCounts(book.id);
  const entry = LIBRARY_BY_ID[book.id];
  if (!counts || !entry) return null;

  return (
    <article className="flex gap-5 rounded-2xl border bg-card p-5 shadow-card transition-shadow hover:shadow-card-hover">
      <BookCover src={book.cover} title={book.title} author={book.author} className="w-28 shrink-0 sm:w-32" />
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex flex-wrap items-center gap-2">
          <Chip variant="code" className="bg-espresso">{book.code}</Chip>
          <Chip variant="outline">{book.department}</Chip>
        </div>
        <h2 className="mt-2 text-lg font-semibold leading-snug">{book.title}</h2>
        <p className="text-sm text-muted-foreground">
          {book.author} · {book.edition} ed.
        </p>

        <dl className="mt-3 grid grid-cols-4 gap-2 text-center">
          {(
            [
              ["Total", counts.total, "text-foreground"],
              ["Available", counts.available, "text-success-foreground"],
              ["Reserved", counts.reserved, "text-warning-foreground"],
              ["Issued", counts.issued, "text-muted-foreground"],
            ] as const
          ).map(([label, n, tone]) => (
            <div key={label} className="rounded-lg bg-secondary py-1.5">
              <dd className={`font-heading text-lg font-bold ${tone}`}>{n}</dd>
              <dt className="text-[0.6rem] uppercase tracking-wider text-muted-foreground">{label}</dt>
            </div>
          ))}
        </dl>

        <div className="mt-auto flex items-center justify-between gap-2 pt-4">
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="size-3.5" /> Shelf {entry.shelf}
          </span>
          <ReserveButton book={book} size="sm" />
        </div>
      </div>
    </article>
  );
}
