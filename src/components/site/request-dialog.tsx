import { useState } from "react";
import { useNavigate, useLocation } from "@tanstack/react-router";
import { BookOpenCheck, Library } from "lucide-react";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BookCover } from "./book-cover";
import { formatPrice } from "@/lib/format";
import type { Listing } from "@/lib/books";
import { createRequest, useCurrentUser } from "@/lib/store";

const DURATIONS = [7, 14, 30, 60];

export function RequestButton({
  listing,
  label = "Request",
  ...buttonProps
}: { listing: Listing; label?: string } & ButtonProps) {
  const user = useCurrentUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const isOwner = user?.id === listing.ownerId;

  const onClick = () => {
    if (!user) {
      toast("Log in to request books", { description: "It only takes a minute to create an account." });
      void navigate({ to: "/login", search: { redirect: location.href } });
      return;
    }
    setOpen(true);
  };

  return (
    <>
      <Button
        {...buttonProps}
        disabled={!listing.available || isOwner || buttonProps.disabled}
        onClick={onClick}
      >
        <Library />
        {isOwner ? "Your book" : listing.available ? label : "Lent out"}
      </Button>
      {user && <RequestDialog listing={listing} open={open} onOpenChange={setOpen} />}
    </>
  );
}

function RequestDialog({
  listing,
  open,
  onOpenChange,
}: {
  listing: Listing;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [days, setDays] = useState("14");
  const [mode, setMode] = useState<"borrow" | "buy">(listing.offer === "sale" ? "buy" : "borrow");
  const [message, setMessage] = useState("");

  const submit = () => {
    try {
      createRequest({
        listingId: listing.id,
        days: Number(days),
        wantsToBuy: mode === "buy",
        message,
      });
      toast.success(`Request sent to ${listing.ownerName}`, {
        description: "Track it any time from your dashboard.",
      });
      setMessage("");
      onOpenChange(false);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Couldn't send the request.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl">Request this book</DialogTitle>
          <DialogDescription>
            {listing.ownerName} will get your request and can approve it in a tap.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-4 rounded-xl bg-secondary p-3">
          <BookCover src={listing.cover} title={listing.title} className="w-16 shrink-0" />
          <div className="min-w-0">
            <p className="font-heading font-semibold leading-snug">{listing.title}</p>
            <p className="text-sm text-muted-foreground">{listing.author}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {listing.condition} · {listing.edition} ed.
              {listing.price !== undefined && ` · ${formatPrice(listing.price)}`}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {listing.offer === "borrow-or-buy" && (
            <RadioGroup
              value={mode}
              onValueChange={(v) => setMode(v as "borrow" | "buy")}
              className="grid grid-cols-2 gap-2"
            >
              {(["borrow", "buy"] as const).map((m) => (
                <Label
                  key={m}
                  htmlFor={`mode-${m}`}
                  className="flex cursor-pointer items-center gap-2 rounded-lg border p-3 has-[:checked]:border-primary has-[:checked]:bg-secondary"
                >
                  <RadioGroupItem id={`mode-${m}`} value={m} />
                  {m === "borrow" ? "Borrow it" : `Buy for ${formatPrice(listing.price ?? 0)}`}
                </Label>
              ))}
            </RadioGroup>
          )}

          {mode === "borrow" && (
            <div className="space-y-1.5">
              <Label>How long do you need it?</Label>
              <Select value={days} onValueChange={setDays}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DURATIONS.map((d) => (
                    <SelectItem key={d} value={String(d)}>
                      {d} days
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="req-msg">Message to the owner (optional)</Label>
            <Textarea
              id="req-msg"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Hi! I can pick it up near the library after 3 PM."
              maxLength={300}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={submit}>
            <BookOpenCheck />
            Send request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
