import { format, formatDistanceToNowStrict } from "date-fns";

export function formatPrice(rupees: number): string {
  return `₹${rupees.toLocaleString("en-IN")}`;
}

export function formatDate(iso: string): string {
  return format(new Date(iso), "d MMM yyyy");
}

export function formatDateTime(iso: string): string {
  return format(new Date(iso), "d MMM yyyy, h:mm a");
}

export function timeAgo(iso: string): string {
  return `${formatDistanceToNowStrict(new Date(iso))} ago`;
}
