// lib/tmClient.ts
import { Event as EventItem } from "@/app/types/event";
const base = "http://localhost:3000";

export const revalidate = 0;

export const tmNow = () => {
  return new Date().toISOString().slice(0, 19) + "Z";
};

export const tmPlusDays = (n: number) => {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 19) + "Z";
};

export async function getEvents(params: Record<string, string>) {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${base}/api/events/ticketmaster?${qs}`, {
    cache: "no-store",
  });
  if (!res.ok) return [] as EventItem[];
  const json = await res.json();
  return (json?.data?.data ?? []) as EventItem[];
}
