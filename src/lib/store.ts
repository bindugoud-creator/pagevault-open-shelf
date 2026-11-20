// Browser-saved app state (accounts, uploads, borrow requests, reservations).
import { useSyncExternalStore } from "react";
import {
  LIBRARY_BY_ID,
  SEED_LISTINGS,
  type Condition,
  type Department,
  type Listing,
  type Offer,
  type Role,
} from "./books";
import {
  effectiveStatus,
  liveCounts,
  loanDueDate,
  pickupDeadline,
  reservationCode,
  type Reservation,
} from "./library";

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  department: Department;
  rollNo?: string;
  passwordHash: string;
  createdAt: string;
};

export type RequestStatus = "pending" | "approved" | "declined" | "cancelled" | "returned";

export type BorrowRequest = {
  id: string;
  listingId: string;
  userId: string;
  userName: string;
  days: number;
  wantsToBuy: boolean;
  message: string;
  status: RequestStatus;
  createdAt: string;
};

type State = {
  users: User[];
  sessionUserId: string | null;
  listings: Listing[];
  requests: BorrowRequest[];
  reservations: Reservation[];
  reservationSeq: number;
};

const STORAGE_KEY = "mrv-bookhub-v1";

const EMPTY: State = {
  users: [],
  sessionUserId: null,
  listings: [],
  requests: [],
  reservations: [],
  reservationSeq: 41,
};

let state: State | null = null;
const listeners = new Set<() => void>();

function load(): State {
  if (state) return state;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    state = raw ? { ...EMPTY, ...(JSON.parse(raw) as Partial<State>) } : EMPTY;
  } catch {
    state = EMPTY;
  }
  return state;
}

function setState(updater: (s: State) => State) {
  state = updater(load());
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // storage full or blocked — keep the in-memory copy
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      state = null;
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function useAppState(): State {
  return useSyncExternalStore(subscribe, load, () => EMPTY);
}

const uid = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);

async function hashPassword(password: string): Promise<string> {
  const data = new TextEncoder().encode(`mrv-bookhub:${password}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/* ---------------- Selectors ---------------- */

export function useCurrentUser(): User | null {
  const s = useAppState();
  return s.users.find((u) => u.id === s.sessionUserId) ?? null;
}

export function useAllListings(): Listing[] {
  const s = useAppState();
  return [...s.listings, ...SEED_LISTINGS].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export function useListing(id: string): Listing | undefined {
  const s = useAppState();
  return s.listings.find((l) => l.id === id) ?? SEED_LISTINGS.find((l) => l.id === id);
}

export function useLiveCounts(bookId: string) {
  const s = useAppState();
  const entry = LIBRARY_BY_ID[bookId];
  return entry ? liveCounts(entry, s.reservations) : undefined;
}

/* ---------------- Auth ---------------- */

export async function register(input: {
  name: string;
  email: string;
  password: string;
  role: Role;
  department: Department;
  rollNo?: string;
}): Promise<User> {
  const email = input.email.trim().toLowerCase();
  if (load().users.some((u) => u.email === email)) {
    throw new Error("An account with this email already exists. Try logging in.");
  }
  const user: User = {
    id: uid(),
    name: input.name.trim(),
    email,
    role: input.role,
    department: input.department,
    passwordHash: await hashPassword(input.password),
    createdAt: new Date().toISOString(),
  };
  if (input.rollNo?.trim()) user.rollNo = input.rollNo.trim();
  setState((s) => ({ ...s, users: [...s.users, user], sessionUserId: user.id }));
  return user;
}

export async function login(emailRaw: string, password: string): Promise<User> {
  const email = emailRaw.trim().toLowerCase();
  const user = load().users.find((u) => u.email === email);
  if (!user || user.passwordHash !== (await hashPassword(password))) {
    throw new Error("That email and password don't match an account.");
  }
  setState((s) => ({ ...s, sessionUserId: user.id }));
  return user;
}

export function logout() {
  setState((s) => ({ ...s, sessionUserId: null }));
}

function requireUser(): User {
  const s = load();
  const user = s.users.find((u) => u.id === s.sessionUserId);
  if (!user) throw new Error("Please log in first.");
  return user;
}

/* ---------------- Listings ---------------- */

export function addListing(input: {
  bookId?: string;
  title: string;
  author: string;
  code: string;
  department: Department;
  edition: string;
  condition: Condition;
  offer: Offer;
  price?: number;
  cover?: string;
  notes?: string;
}): Listing {
  const user = requireUser();
  const listing: Listing = {
    id: `u-${uid()}`,
    title: input.title.trim(),
    author: input.author.trim(),
    code: input.code.trim().toUpperCase(),
    department: input.department,
    edition: input.edition.trim() || "—",
    condition: input.condition,
    offer: input.offer,
    ownerId: user.id,
    ownerName: user.name,
    ownerInfo: `${user.department} · ${user.role}`,
    available: true,
    createdAt: new Date().toISOString(),
  };
  if (input.bookId) listing.bookId = input.bookId;
  if (input.cover) listing.cover = input.cover;
  if (input.offer !== "free" && input.price !== undefined) listing.price = input.price;
  if (input.notes?.trim()) listing.notes = input.notes.trim();
  setState((s) => ({ ...s, listings: [listing, ...s.listings] }));
  return listing;
}

export function setListingAvailable(id: string, available: boolean) {
  setState((s) => ({
    ...s,
    listings: s.listings.map((l) => (l.id === id ? { ...l, available } : l)),
  }));
}

export function removeListing(id: string) {
  setState((s) => ({
    ...s,
    listings: s.listings.filter((l) => l.id !== id),
    requests: s.requests.filter((r) => r.listingId !== id),
  }));
}

/* ---------------- Borrow requests ---------------- */

export function createRequest(input: {
  listingId: string;
  days: number;
  wantsToBuy: boolean;
  message: string;
}): BorrowRequest {
  const user = requireUser();
  const s = load();
  const open = s.requests.find(
    (r) => r.listingId === input.listingId && r.userId === user.id && r.status === "pending",
  );
  if (open) throw new Error("You already have a pending request for this book.");
  const req: BorrowRequest = {
    id: uid(),
    listingId: input.listingId,
    userId: user.id,
    userName: user.name,
    days: input.days,
    wantsToBuy: input.wantsToBuy,
    message: input.message.trim(),
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  setState((st) => ({ ...st, requests: [req, ...st.requests] }));
  return req;
}

export function setRequestStatus(id: string, status: RequestStatus) {
  setState((s) => ({
    ...s,
    requests: s.requests.map((r) => (r.id === id ? { ...r, status } : r)),
  }));
}

/* ---------------- Library reservations ---------------- */

export function reserveLibraryCopy(bookId: string): Reservation {
  const user = requireUser();
  const s = load();
  const entry = LIBRARY_BY_ID[bookId];
  if (!entry) throw new Error("This title isn't in the library catalogue.");
  const mine = s.reservations.find(
    (r) => r.bookId === bookId && r.userId === user.id && effectiveStatus(r) === "active",
  );
  if (mine) throw new Error(`You already reserved this title (${mine.code}).`);
  if (liveCounts(entry, s.reservations).available <= 0) {
    throw new Error("No copies are available right now.");
  }
  const now = new Date();
  const seq = s.reservationSeq + 1;
  const reservation: Reservation = {
    id: uid(),
    code: reservationCode(seq, now),
    bookId,
    userId: user.id,
    userName: user.name,
    status: "active",
    createdAt: now.toISOString(),
    expiresAt: pickupDeadline(now).toISOString(),
  };
  setState((st) => ({
    ...st,
    reservationSeq: seq,
    reservations: [reservation, ...st.reservations],
  }));
  return reservation;
}

export function cancelReservation(id: string) {
  setState((s) => ({
    ...s,
    reservations: s.reservations.map((r) => (r.id === id ? { ...r, status: "cancelled" } : r)),
  }));
}

export function issueReservation(id: string) {
  const now = new Date();
  setState((s) => ({
    ...s,
    reservations: s.reservations.map((r) =>
      r.id === id
        ? {
            ...r,
            status: "collected",
            collectedAt: now.toISOString(),
            dueAt: loanDueDate(now).toISOString(),
          }
        : r,
    ),
  }));
}

export function returnReservation(id: string) {
  setState((s) => ({
    ...s,
    reservations: s.reservations.map((r) =>
      r.id === id ? { ...r, status: "returned", returnedAt: new Date().toISOString() } : r,
    ),
  }));
}
