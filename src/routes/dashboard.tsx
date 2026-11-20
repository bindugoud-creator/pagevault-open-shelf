import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookCover } from "@/components/site/book-cover";
import { Chip } from "@/components/site/chip";
import { BOOKS_BY_ID, SEED_LISTINGS } from "@/lib/books";
import { effectiveStatus } from "@/lib/library";
import { formatDate, formatDateTime } from "@/lib/format";
import {
  cancelReservation,
  issueReservation,
  removeListing,
  returnReservation,
  setRequestStatus,
  useAppState,
  useCurrentUser,
} from "@/lib/store";

type DashSearch = { tab?: string };

export const Route = createFileRoute("/dashboard")({
  validateSearch: (s: Record<string, unknown>): DashSearch =>
    typeof s["tab"] === "string" ? { tab: s["tab"] } : {},
  head: () => ({
    meta: [
      { title: "My dashboard · MRV BookHub" },
      { name: "description", content: "Your borrow requests, library reservations and listed books on MRV BookHub." },
      { property: "og:title", content: "My dashboard · MRV BookHub" },
      { property: "og:description", content: "Track your requests, reservations and listings." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Dashboard,
});

function Row({ cover, title, sub, right }: { cover?: string | undefined; title: string; sub: string; right: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border bg-card p-4 shadow-card">
      <BookCover src={cover} title={title} className="w-16 shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="font-heading font-semibold">{title}</p>
        <p className="text-sm text-muted-foreground">{sub}</p>
      </div>
      <div className="flex flex-wrap items-center justify-end gap-2">{right}</div>
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return <p className="rounded-2xl border border-dashed p-10 text-center text-muted-foreground">{text}</p>;
}

function Dashboard() {
  const user = useCurrentUser();
  const state = useAppState();
  const { tab } = Route.useSearch();
  const navigate = useNavigate({ from: "/dashboard" });

  if (!user) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <h1 className="text-3xl font-bold">Log in to see your dashboard</h1>
        <Button className="mt-6" asChild>
          <Link to="/login" search={{ redirect: "/dashboard" }}>Log in</Link>
        </Button>
      </div>
    );
  }

  const allListings = [...state.listings, ...SEED_LISTINGS];
  const myRequests = state.requests.filter((r) => r.userId === user.id);
  const myReservations = state.reservations.filter((r) => r.userId === user.id);
  const myListings = state.listings.filter((l) => l.ownerId === user.id);
  const isStaff = user.role === "Librarian" || user.role === "Admin";

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 lg:px-8">
      <p className="eyebrow text-primary">{user.role} · {user.department}</p>
      <h1 className="mt-1 text-4xl font-bold">Hi, {user.name.split(" ")[0]}</h1>
      <Tabs value={tab ?? "requests"} onValueChange={(v) => void navigate({ search: { tab: v }, replace: true })} className="mt-8">
        <TabsList>
          <TabsTrigger value="requests">Requests ({myRequests.length})</TabsTrigger>
          <TabsTrigger value="reservations">Reservations ({myReservations.length})</TabsTrigger>
          <TabsTrigger value="listings">My books ({myListings.length})</TabsTrigger>
          {isStaff && <TabsTrigger value="desk">Library desk</TabsTrigger>}
        </TabsList>

        <TabsContent value="requests" className="mt-6 space-y-3">
          {myRequests.length === 0 && <Empty text="No borrow requests yet — find a book on the Browse page." />}
          {myRequests.map((r) => {
            const l = allListings.find((x) => x.id === r.listingId);
            return (
              <Row key={r.id} cover={l?.cover} title={l?.title ?? "Removed book"}
                sub={`${r.wantsToBuy ? "Buy" : `Borrow · ${r.days} days`} · from ${l?.ownerName ?? "—"} · ${formatDate(r.createdAt)}`}
                right={<>
                  <Chip variant={r.status === "pending" ? "warning" : r.status === "approved" ? "success" : "outline"}>{r.status}</Chip>
                  {r.status === "pending" && <Button size="sm" variant="ghost" onClick={() => setRequestStatus(r.id, "cancelled")}>Cancel</Button>}
                </>} />
            );
          })}
        </TabsContent>

        <TabsContent value="reservations" className="mt-6 space-y-3">
          {myReservations.length === 0 && <Empty text="No library reservations yet." />}
          {myReservations.map((r) => {
            const b = BOOKS_BY_ID[r.bookId];
            const status = effectiveStatus(r);
            return (
              <Row key={r.id} cover={b?.cover} title={b?.title ?? r.bookId}
                sub={`${r.code} · ${status === "active" ? `collect by ${formatDateTime(r.expiresAt)}` : status === "collected" && r.dueAt ? `due ${formatDate(r.dueAt)}` : formatDate(r.createdAt)}`}
                right={<>
                  <Chip variant={status === "active" ? "warning" : status === "collected" ? "success" : "outline"}>{status}</Chip>
                  {status === "active" && <Button size="sm" variant="ghost" onClick={() => cancelReservation(r.id)}>Cancel</Button>}
                </>} />
            );
          })}
        </TabsContent>

        <TabsContent value="listings" className="mt-6 space-y-3">
          {myListings.length === 0 && <Empty text="You haven't listed any books yet." />}
          {myListings.map((l) => (
            <Row key={l.id} cover={l.cover} title={l.title} sub={`${l.code} · ${l.condition} · ${state.requests.filter((r) => r.listingId === l.id).length} requests`}
              right={<Button size="sm" variant="ghost" onClick={() => removeListing(l.id)}>Remove</Button>} />
          ))}
          <Button asChild><Link to="/upload">Upload a book</Link></Button>
        </TabsContent>

        {isStaff && (
          <TabsContent value="desk" className="mt-6 space-y-3">
            {state.reservations.length === 0 && <Empty text="No reservations to handle." />}
            {state.reservations.map((r) => {
              const b = BOOKS_BY_ID[r.bookId];
              const status = effectiveStatus(r);
              return (
                <Row key={r.id} cover={b?.cover} title={b?.title ?? r.bookId} sub={`${r.code} · ${r.userName}`}
                  right={<>
                    <Chip variant="outline">{status}</Chip>
                    {status === "active" && <Button size="sm" onClick={() => issueReservation(r.id)}>Issue</Button>}
                    {status === "collected" && <Button size="sm" variant="outline" onClick={() => returnReservation(r.id)}>Mark returned</Button>}
                  </>} />
              );
            })}
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
