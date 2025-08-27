"use client";
import { useState, useMemo } from "react";
import Image from "next/image";
import { Event } from "@/app/types/event";
import { useCheckoutStore } from "@/store/checkout";
import { AttendeeSchema } from "@/lib/validation";

export default function Step2({ event }: { event: Event }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
    idNumber: "",
  });
  const quantity = useCheckoutStore((s) => s.quantity);
  const setAttendee = useCheckoutStore((s) => s.setAttendee);
  const basePrice =
    event.price?.min && event.price.min > 0 ? event.price.min : 100;
  const total = useMemo(() => basePrice * quantity, [basePrice, quantity]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const isFormValid = Boolean(
    form.name &&
      form.email &&
      form.phone &&
      form.dob &&
      form.gender &&
      form.idNumber
  );

  async function handleSubmit() {
    setError(null);
    if (!isFormValid) return;
    if (quantity <= 0) {
      setError("Please select quantity in Step 1");
      return;
    }
    const parsed = AttendeeSchema.safeParse(form);
    if (!parsed.success) {
      setError("Validation failed");
      return;
    }
    setSubmitting(true);
    try {
      setAttendee(parsed.data);
      const payload = {
        eventSource: event.source || "ticketmaster",
        eventId: event.id,
        quantity,
        totalAmount: total * 100, // to cents
        currency: event.price?.currency || "AUD",
        attendee: parsed.data,
      };
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok || !json.success)
        throw new Error(json.message || "Order failed");
      setSuccess(true);
      // TODO: trigger /api/checkout then redirect to Stripe.
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-120px)] bg-gray-50 px-4 md:px-20 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Order Form */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow p-6 space-y-6">
          <h2 className="text-xl font-semibold">Attendee</h2>

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Full Name *
            </label>
            <input
              type="text"
              className="w-full border rounded-lg px-3 py-2"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">Email *</label>
            <input
              type="email"
              className="w-full border rounded-lg px-3 py-2"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Phone Number *
            </label>
            <input
              type="tel"
              className="w-full border rounded-lg px-3 py-2"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>

          {/* DOB + Gender */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Date of Birth *
              </label>
              <input
                type="date"
                className="w-full border rounded-lg px-3 py-2"
                value={form.dob}
                onChange={(e) => setForm({ ...form, dob: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Gender *</label>
              <select
                className="w-full border rounded-lg px-3 py-2"
                value={form.gender}
                onChange={(e) => setForm({ ...form, gender: e.target.value })}
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>

          {/* ID Number */}
          <div>
            <label className="block text-sm font-medium mb-1">
              ID Number (Passport/KTP/etc) *
            </label>
            <input
              type="text"
              className="w-full border rounded-lg px-3 py-2"
              value={form.idNumber}
              onChange={(e) => setForm({ ...form, idNumber: e.target.value })}
            />
          </div>

          {/* Payment (Stripe Only) */}
          <div>
            <h3 className="text-lg font-semibold mb-2">
              Available Payment Method
            </h3>
            <div className="flex items-center space-x-2">
              <Image
                src="/images/payment/stripe.webp"
                alt="Stripe"
                width={60}
                height={30}
              />
            </div>
          </div>
        </div>

        {/* Right: Sticky Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow p-6 sticky top-24">
            <h3 className="text-lg font-semibold mb-4">Order Summary</h3>

            <div className="flex justify-between text-sm mb-2">
              <span>{event.name}</span>
              <span>{event.price?.display ?? `$${basePrice}`}</span>
            </div>
            <div className="flex justify-between font-medium border-t pt-2">
              <span>Grand Total</span>
              <span>
                {quantity > 0
                  ? `${
                      event.price?.currency || "AUD"
                    } ${total.toLocaleString()}`
                  : "--"}
              </span>
            </div>

            {/* Pay Now */}
            <button
              disabled={!isFormValid || submitting || success}
              onClick={handleSubmit}
              className={`mt-6 w-full py-3 rounded-lg font-semibold ${
                isFormValid && !submitting
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {success ? "Saved" : submitting ? "Saving..." : "Pay Now"}
            </button>
            {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
            {success && (
              <p className="text-sm text-green-600 mt-2">
                Order created (pending). Stripe session next.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Bottom Action */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-md p-4">
        <div className="flex justify-between items-center">
          <span className="font-semibold">Rp 250.000</span>
          <button
            disabled={!isFormValid}
            className={`px-6 py-2 rounded-lg font-semibold ${
              isFormValid
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Pay Now
          </button>
        </div>
      </div>
    </div>
  );
}
