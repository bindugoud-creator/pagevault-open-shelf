import { useState } from "react";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { BookmarkCheck, CalendarClock, MapPin } from "lucide-react";
import { toast } from "sonner";
import { Button, type ButtonProps } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BookCover } from "./book-cover";
import { LIBRARY_BY_ID, type Book } from "@/lib/books";
import { PICKUP_WINDOW_HOURS, type Reservation } from "@/lib/library";
import { formatDateTime } from "@/lib/format";
import { reserveLibraryCopy, useCurrentUser, useLiveCounts } from "@/lib/store";

export function ReserveButton({
  book,
  label = "Reserve",
  ...buttonProps
}: { book: Book; label?: string } & ButtonProps) {
  const user = useCurrentUser();
  const counts = useLiveCounts(book.id);
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState<Reservation | null>(null);
  const entry = LIBRARY_BY_ID[book.id];
  const available = counts?.available ?? 0;

  const onClick = () => {
    if (!user) {
      toast("Log in to reserve library copies");
      void navigate({ to: "/login", search: { redirect: location.href } });
      return;
    }
    setDone(null);
    setOpen(true);
  };

  const confirm = () => {
    try {
      const r = reserveLibraryCopy(book.id);
      setDone(r);
      toast.success(`Reserved · ${r.code}`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Couldn't reserve this copy.");
    }
  };

  return (
    <>
      <Button {...buttonProps} disabled={available === 0 || buttonProps.disabled} onClick={onClick}>
        <BookmarkCheck />
        {available === 0 ? "All copies out" : label}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading text-2xl">
              {done ? "Copy reserved" : "Reserve a library copy"}
            </DialogTitle>
            <DialogDescription>
              {done
                ? "Show this reservation ID at the library counter."
                : `Collect it at the MRV Central Library counter within ${PICKUP_WINDOW_HOURS} hours.`}
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center gap-4 rounded-xl bg-secondary p-3">
            <BookCover src={book.cover} title={book.title} className="w-16 shrink-0" />
            <div className="min-w-0">
              <p className="font-heading font-semibold leading-snug">{book.title}</p>
              <p className="text-sm text-muted-foreground">{book.author}</p>
              <p className="mt-1 font-mono text-xs text-muted-foreground">
                {book.code} · {available} of {counts?.total ?? 0} available
              </p>
            </div>
          </div>

          {done && (
            <div className="space-y-3 rounded-xl border border-dashed border-primary/40 p-4">
              <p className="eyebrow text-primary">Reservation ID</p>
              <p className="font-mono text-2xl font-semibold tracking-wider">{done.code}</p>
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <CalendarClock className="size-4" /> Collect by {formatDateTime(done.expiresAt)}
              </p>
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="size-4" /> Shelf {entry?.shelf} · Ground floor counter
              </p>
            </div>
          )}

          <DialogFooter>
            {done ? (
              <>
                <Button variant="ghost" onClick={() => setOpen(false)}>
                  Close
                </Button>
                <Button onClick={() => void navigate({ to: "/dashboard", search: { tab: "reservations" } })}>
                  View my reservations
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={confirm}>
                  <BookmarkCheck />
                  Confirm reservation
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
