import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { CloudUpload, ImagePlus, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BookCover } from "@/components/site/book-cover";
import {
  BOOKS,
  CONDITIONS,
  DEPARTMENTS,
  OFFERS,
  matchCatalogue,
  type Condition,
  type Department,
  type Offer,
} from "@/lib/books";
import { addListing, useCurrentUser } from "@/lib/store";

export const Route = createFileRoute("/upload")({
  head: () => ({
    meta: [
      { title: "Upload a book · MRV BookHub" },
      { name: "description", content: "List your spare textbook on MRV BookHub — lend it free or sell it to a classmate." },
      { property: "og:title", content: "Upload a book · MRV BookHub" },
      { property: "og:description", content: "Lend or sell your spare textbooks to MRV classmates." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: UploadPage,
});

async function shrinkImage(file: File): Promise<string> {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const i = new Image();
      i.onload = () => resolve(i);
      i.onerror = reject;
      i.src = url;
    });
    const scale = Math.min(1, 420 / img.width);
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(img.width * scale);
    canvas.height = Math.round(img.height * scale);
    canvas.getContext("2d")?.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.82);
  } finally {
    URL.revokeObjectURL(url);
  }
}

function UploadPage() {
  const user = useCurrentUser();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [code, setCode] = useState("");
  const [edition, setEdition] = useState("");
  const [department, setDepartment] = useState<Department>("CSE");
  const [condition, setCondition] = useState<Condition>("Good");
  const [offer, setOffer] = useState<Offer>("free");
  const [price, setPrice] = useState("");
  const [notes, setNotes] = useState("");
  const [photo, setPhoto] = useState<string | undefined>();
  const [bookId, setBookId] = useState<string | undefined>();

  const catalogueCover = bookId ? BOOKS.find((b) => b.id === bookId)?.cover : undefined;
  const cover = photo ?? catalogueCover;

  const onTitle = (v: string) => {
    setTitle(v);
    const match = matchCatalogue(v);
    if (match) {
      setBookId(match.id);
      setAuthor(match.author);
      setCode(match.code);
      setEdition(match.edition);
      setDepartment(match.department);
    } else {
      setBookId(undefined);
    }
  };

  if (!user) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <CloudUpload className="mx-auto size-10 text-primary" />
        <h1 className="mt-4 text-3xl font-bold">Log in to list a book</h1>
        <p className="mt-2 text-muted-foreground">
          Your classmates need to know who they're borrowing from.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Button variant="outline" asChild>
            <Link to="/login" search={{ redirect: "/upload" }}>Log in</Link>
          </Button>
          <Button asChild>
            <Link to="/register" search={{ redirect: "/upload" }}>Create account</Link>
          </Button>
        </div>
      </div>
    );
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = Number(price);
    if (offer !== "free" && (!price || Number.isNaN(priceNum) || priceNum <= 0)) {
      toast.error("Add a price in rupees for books you're selling.");
      return;
    }
    try {
      const listing = addListing({
        ...(bookId ? { bookId } : {}),
        title,
        author,
        code,
        department,
        edition,
        condition,
        offer,
        ...(offer !== "free" ? { price: priceNum } : {}),
        ...(cover ? { cover } : {}),
        notes,
      });
      toast.success("Your book is on the shelf!");
      void navigate({ to: "/books/$listingId", params: { listingId: listing.id } });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't list the book.");
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 lg:px-8">
      <p className="eyebrow text-primary">Share your shelf</p>
      <h1 className="mt-1 text-4xl font-bold">Upload a book</h1>
      <p className="mt-2 text-muted-foreground">
        Start typing a title — if it's in our catalogue we'll fill in the details and cover for you.
      </p>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_300px]">
        <form onSubmit={submit} className="space-y-5 rounded-2xl border bg-card p-6 shadow-card">
          <div className="space-y-1.5">
            <Label htmlFor="title">Book title</Label>
            <Input id="title" list="catalogue" required value={title} onChange={(e) => onTitle(e.target.value)} placeholder="e.g. Operating System Concepts" className="h-11" />
            <datalist id="catalogue">
              {BOOKS.map((b) => <option key={b.id} value={b.title} />)}
            </datalist>
            {bookId && (
              <p className="flex items-center gap-1 text-xs text-success-foreground">
                <Sparkles className="size-3" /> Found in the catalogue — details filled in.
              </p>
            )}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="author">Author</Label>
              <Input id="author" required value={author} onChange={(e) => setAuthor(e.target.value)} className="h-11" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="code">Course code</Label>
              <Input id="code" required value={code} onChange={(e) => setCode(e.target.value)} placeholder="CS301" className="h-11 font-mono uppercase" />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="edition">Edition</Label>
              <Input id="edition" value={edition} onChange={(e) => setEdition(e.target.value)} placeholder="10th" className="h-11" />
            </div>
            <div className="space-y-1.5">
              <Label>Department</Label>
              <Select value={department} onValueChange={(v) => setDepartment(v as Department)}>
                <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {DEPARTMENTS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Condition</Label>
              <Select value={condition} onValueChange={(v) => setCondition(v as Condition)}>
                <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CONDITIONS.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Offer</Label>
              <Select value={offer} onValueChange={(v) => setOffer(v as Offer)}>
                <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(OFFERS).map(([k, l]) => <SelectItem key={k} value={k}>{l}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            {offer !== "free" && (
              <div className="space-y-1.5">
                <Label htmlFor="price">Price (₹)</Label>
                <Input id="price" type="number" min={1} value={price} onChange={(e) => setPrice(e.target.value)} placeholder="450" className="h-11" />
              </div>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="notes">Notes for borrowers (optional)</Label>
            <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Highlights, missing pages, where to meet…" maxLength={300} />
          </div>
          <Button type="submit" variant="hero" size="xl" className="w-full sm:w-auto">
            <CloudUpload /> Put it on the shelf
          </Button>
        </form>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <p className="eyebrow text-primary">Cover preview</p>
          <div className="mt-3 rounded-2xl bg-cover-panel p-8">
            <BookCover src={cover} title={title || "Your book title"} author={author || "Author"} className="mx-auto w-full max-w-[220px]" />
          </div>
          <label className="mt-4 flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed p-3 text-sm font-medium text-primary hover:bg-secondary">
            <ImagePlus className="size-4" />
            {photo ? "Change cover photo" : "Add a photo of your copy"}
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                if (file.size > 8 * 1024 * 1024) {
                  toast.error("Please choose a photo under 8 MB.");
                  return;
                }
                setPhoto(await shrinkImage(file));
              }}
            />
          </label>
        </aside>
      </div>
    </div>
  );
}
