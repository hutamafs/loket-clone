// app/checkout/[eventId]/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export default function CheckoutPage({
  params,
}: {
  params: { eventId: string };
}) {
  const [step, setStep] = useState<1 | 2>(1);
  const [ticketQty, setTicketQty] = useState(1);
  const [buyer, setBuyer] = useState({ name: "", email: "" });
  const router = useRouter();

  // Dummy price for MVP (replace with API fetch later)
  const price = 25;
  const total = price * ticketQty;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      {step === 1 && (
        <div>
          <h2 className="text-lg font-semibold mb-3">Select Ticket</h2>
          <div className="rounded border p-4 mb-6">
            <p className="font-medium">General Admission</p>
            <p className="text-gray-600">${price}</p>
            <div className="mt-3 flex items-center gap-2">
              <button
                className="px-3 py-1 border rounded"
                onClick={() => setTicketQty((q) => Math.max(1, q - 1))}
              >
                -
              </button>
              <span>{ticketQty}</span>
              <button
                className="px-3 py-1 border rounded"
                onClick={() => setTicketQty((q) => q + 1)}
              >
                +
              </button>
            </div>
          </div>

          <button
            onClick={() => setStep(2)}
            className="w-full bg-blue-600 text-white h-11 rounded-lg hover:bg-blue-700"
          >
            Continue
          </button>
        </div>
      )}

      {step === 2 && (
        <Elements stripe={stripePromise}>
          <CheckoutForm
            buyer={buyer}
            setBuyer={setBuyer}
            total={total}
            eventId={params.eventId}
          />
        </Elements>
      )}
    </div>
  );
}

function CheckoutForm({ buyer, setBuyer, total, eventId }: any) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);

    const cardElement = elements.getElement(CardElement);

    // Call your API route to create payment intent
    const res = await fetch("/api/checkout/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ total, eventId, buyer }),
    });

    const { clientSecret } = await res.json();

    const { error, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      { payment_method: { card: cardElement! } }
    );

    setLoading(false);

    if (error) {
      alert(error.message);
    } else if (paymentIntent?.status === "succeeded") {
      window.location.href = `/success/${eventId}`;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Buyer Info */}
      <input
        type="text"
        placeholder="Full Name"
        value={buyer.name}
        onChange={(e) => setBuyer({ ...buyer, name: e.target.value })}
        className="w-full border rounded p-2"
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={buyer.email}
        onChange={(e) => setBuyer({ ...buyer, email: e.target.value })}
        className="w-full border rounded p-2"
        required
      />

      {/* Stripe Card Input */}
      <div className="border rounded p-3">
        <CardElement options={{ style: { base: { fontSize: "16px" } } }} />
      </div>

      <div className="flex justify-between items-center font-semibold">
        <span>Total</span>
        <span>${total}</span>
      </div>

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-green-600 text-white h-11 rounded-lg hover:bg-green-700"
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </form>
  );
}
