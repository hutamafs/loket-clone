import { z } from "zod";

const schema = z.object({
  NEXT_PUBLIC_BASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(10),
  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: z.string().min(10),
  STRIPE_SECRET_KEY: z.string().min(10).optional(), // Optional until Stripe wired
  STRIPE_WEBHOOK_SECRET: z.string().min(10).optional(),
});

type Env = z.infer<typeof schema>;

let _env: Env | null = null;
export function env(): Env {
  if (_env) return _env;
  const parsed = schema.safeParse(process.env);
  if (!parsed.success) {
    console.error("❌ Invalid environment variables:");
    console.error(parsed.error.flatten().fieldErrors);
    throw new Error("Environment validation failed");
  }
  _env = parsed.data;
  return _env;
}
// Usage: import { env } and call env() inside server code to access validated vars.
