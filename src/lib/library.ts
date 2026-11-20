// Central Library rules: pickup window, loan length and live copy counts.
import type { LibraryEntry } from "./books";

export const PICKUP_WINDOW_HOURS = 48;
export const LOAN_DAYS = 14;

export type ReservationStatus = "active" | "collected" | "returned" | "cancelled" | "expired";

export type Reservation = {
  id: string;
  code: string;
  bookId: string;
  userId: string;
  userName: string;
  status: ReservationStatus;
  createdAt: string;
  expiresAt: string;
  collectedAt?: string;
  dueAt?: string;
  returnedAt?: string;
};

export function pickupDeadline(createdAt: Date): Date {
  return new Date(createdAt.getTime() + PICKUP_WINDOW_HOURS * 60 * 60 * 1000);
}

export function loanDueDate(collectedAt: Date): Date {
  return new Date(collectedAt.getTime() + LOAN_DAYS * 24 * 60 * 60 * 1000);
}

export function reservationCode(sequence: number, date: Date): string {
  return `MRV-RSV-${date.getFullYear()}-${String(sequence).padStart(4, "0")}`;
}

/** An active reservation that was not collected inside the pickup window has expired. */
export function effectiveStatus(r: Reservation, now: Date = new Date()): ReservationStatus {
  if (r.status === "active" && new Date(r.expiresAt).getTime() < now.getTime()) return "expired";
  return r.status;
}

export type LiveCounts = { total: number; available: number; reserved: number; issued: number };

export function liveCounts(
  entry: LibraryEntry,
  reservations: Reservation[],
  now: Date = new Date(),
): LiveCounts {
  let reserved = entry.reserved;
  let issued = entry.issued;
  for (const r of reservations) {
    if (r.bookId !== entry.bookId) continue;
    const status = effectiveStatus(r, now);
    if (status === "active") reserved += 1;
    if (status === "collected") issued += 1;
  }
  const available = Math.max(0, entry.total - reserved - issued);
  return { total: entry.total, available, reserved, issued };
}
