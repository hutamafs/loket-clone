"use server";

import { redirect } from "next/navigation";

export async function searchEvents(formData: FormData) {
  const keyword = (formData.get("keyword") || "").toString().trim();
  const city = (formData.get("city") || "").toString();

  const p = new URLSearchParams();
  if (keyword) p.set("keyword", keyword);
  if (city) p.set("city", city); // or lat/lng later

  redirect("/events?" + p.toString());
}
