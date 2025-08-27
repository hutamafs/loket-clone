// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - type resolution may fail under experimental bundler; runtime ok
import Stripe from 'stripe';

// Lazy singleton to avoid re-init in dev hot reload
let _stripe: Stripe | null = null;

export function getStripe() {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error('Missing STRIPE_SECRET_KEY env var');
    _stripe = new Stripe(key, {
      apiVersion: '2024-06-20',
      typescript: true,
    });
  }
  return _stripe;
}
