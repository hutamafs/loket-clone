import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, password } = body;
  if (!email || !password)
    return Response.json(
      { success: false, message: "Missing credentials" },
      { status: 400 }
    );
  const supabase = createRouteHandlerClient({ cookies });
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error)
    return Response.json(
      { success: false, message: error.message },
      { status: 400 }
    );
  return Response.json({ success: true, user: data.user });
}
