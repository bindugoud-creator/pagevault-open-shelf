import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { CloudUpload, Search, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { BookCard } from "@/components/site/book-card";
import { CONDITIONS, DEPARTMENTS, OFFERS } from "@/lib/books";
import { useAllListings } from "@/lib/store";

type BrowseSearch = {
  q?: string;
  dept?: string;
  condition?: string;
  offer?: string;
  available?: boolean;
};

export const Route = createFileRoute("/browse")({
  validateSearch: (s: Record<string, unknown>): BrowseSearch => {
    const out: BrowseSearch = {};
    if (typeof s["q"] === "string" && s["q"]) out.q = s["q"];
    if (typeof s["dept"] === "string" && s["dept"]) out.dept = s["dept"];
    if (typeof s["condition"] === "string" && s["condition"]) out.condition = s["condition"];
    if (typeof s["offer"] === "string" && s["offer"]) out.offer = s["offer"];
    if (s["available"] === true || s["available"] === "true") out.available = true;
    return out;
  },
  head: () => ({
    meta: [
      { title: "Browse Books · MRV BookHub" },
      {
        name: "description",
        content:
          "Browse textbooks shared by MRV students — filter by department, course code, condition and availability.",
      },
      { property: "og:title", content: "Browse Books · MRV BookHub" },
      {
        property: "og:description",
        content: "Textbooks from classmates' shelves, free to borrow or buy.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BrowsePage,
});

const ALL = "all";

function BrowsePage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/browse" });
  const listings = useAllListings();

  const set = (patch: Partial<BrowseSearch>) =>
    void navigate({
      search: (prev) => {
        const next: BrowseSearch = { ...prev };
        for (const [k, v] of Object.entries(patch) as [keyof BrowseSearch, unknown][]) {
          if (v === undefined || v === "" || v === ALL || v === false) delete next[k];
          else (next as Record<string, unknown>)[k] = v;
        }
        return next;
      },
      replace: true,
    });

  const q = (search.q ?? "").toLowerCase();
  const results = listings.filter((l) => {
    if (q && ![l.title, l.author, l.code, l.department].some((f) => f.toLowerCase().includes(q)))
      return false;
    if (search.dept && l.department !== search.dept) return false;
    if (search.condition && l.condition !== search.condition) return false;
    if (search.offer && l.offer !== search.offer) return false;
    if (search.available && !l.available) return false;
    return true;
  });

  const hasFilters = Object.keys(search).length > 0;

  return (
    <div>
      <section className="bg-hero text-cream">
        <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
          <p className="eyebrow text-gold">The community shelf</p>
          <h1 className="mt-2 text-4xl font-bold sm:text-5xl">Browse Books</h1>
          <p className="mt-3 max-w-xl text-cream/75">
            Textbooks shared by MRV students and verified campus vendors. Free to borrow, or pick up
            a copy to keep.
          </p>
          <div className="mt-6 flex max-w-2xl items-center gap-2 rounded-full bg-cream p-1.5 pl-5">
            <Search className="size-5 text-primary" />
            <input
              defaultValue={search.q ?? ""}
              key={search.q ?? ""}
              onChange={(e) => set({ q: e.target.value })}
              placeholder="Title, author, course code…"
              className="min-w-0 flex-1 bg-transparent py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground"
              aria-label="Search books"
            />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
        <div className="flex flex-wrap items-center gap-3 rounded-2xl border bg-card p-4 shadow-card">
          <SlidersHorizontal className="size-4 text-primary" />
          <FilterSelect
            label="Department"
            value={search.dept}
            options={DEPARTMENTS.map((d) => [d, d])}
            onChange={(v) => set({ dept: v })}
          />
          <FilterSelect
            label="Condition"
            value={search.condition}
            options={CONDITIONS.map((c) => [c, c])}
            onChange={(v) => set({ condition: v })}
          />
          <FilterSelect
            label="Offer"
            value={search.offer}
            options={Object.entries(OFFERS)}
            onChange={(v) => set({ offer: v })}
          />
          <div className="flex items-center gap-2 px-2">
            <Switch
              id="avail"
              checked={!!search.available}
              onCheckedChange={(c) => set({ available: c })}
            />
            <Label htmlFor="avail" className="text-sm">
              Available only
            </Label>
          </div>
          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={() => void navigate({ search: {} })}>
              <X /> Clear
            </Button>
          )}
          <span className="ml-auto text-sm text-muted-foreground">
            {results.length} {results.length === 1 ? "book" : "books"}
          </span>
        </div>

        {results.length > 0 ? (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {results.map((l) => (
              <BookCard key={l.id} listing={l} />
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-2xl border border-dashed p-12 text-center">
            <p className="font-heading text-2xl font-semibold">No books match yet</p>
            <p className="mt-2 text-muted-foreground">
              Try a different search, check the Central Library, or list your own copy.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Button variant="outline" asChild>
                <Link to="/digital-library" search={search.q ? { q: search.q } : {}}>
                  Search the library
                </Link>
              </Button>
              <Button asChild>
                <Link to="/upload">
                  <CloudUpload /> Upload a book
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string | undefined;
  options: [string, string][];
  onChange: (v: string) => void;
}) {
  return (
    <Select value={value ?? ALL} onValueChange={onChange}>
      <SelectTrigger className="h-9 w-[170px] rounded-full" aria-label={label}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={ALL}>All {label.toLowerCase()}s</SelectItem>
        {options.map(([v, l]) => (
          <SelectItem key={v} value={v}>
            {l}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

