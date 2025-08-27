import { supabase } from "../supabase";

export interface InsertOrderParams {
  userId: string | null; // allow null for now (guest) until auth
  eventSource: string;
  eventId: string;
  quantity: number;
  status?: "pending" | "paid" | "cancelled";
  totalAmount: number; // cents
  currency: string;
  attendee: {
    name: string;
    email: string;
    phone: string;
    dob: string; // YYYY-MM-DD
    gender?: string;
    idNumber: string;
  };
  stripeSessionId?: string | null;
}

export async function insertPendingOrder(p: InsertOrderParams) {
  const { data, error } = await supabase
    .from("orders")
    .insert({
      user_id: p.userId,
      event_source: p.eventSource,
      event_id: p.eventId,
      quantity: p.quantity,
      status: p.status ?? "pending",
      total_amount: p.totalAmount,
      currency: p.currency,
      attendee_name: p.attendee.name,
      attendee_email: p.attendee.email,
      attendee_phone: p.attendee.phone,
      attendee_dob: p.attendee.dob,
      attendee_gender: p.attendee.gender,
      attendee_id_number: p.attendee.idNumber,
      stripe_session_id: p.stripeSessionId ?? null,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function markOrderPaidBySession(
  sessionId: string,
  totalAmount: number
) {
  const { data, error } = await supabase
    .from("orders")
    .update({ status: "paid", total_amount: totalAmount })
    .eq("stripe_session_id", sessionId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getOrderByStripeSession(sessionId: string) {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("stripe_session_id", sessionId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function getOrderById(id: string) {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function listOrdersForUser(userId: string) {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}
