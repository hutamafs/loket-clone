// app/checkout/step2/page.tsx
"use client";

import { useState } from "react";

export default function CheckoutStep2() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
    idNumber: "",
    agree: false,
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Attendee Details</h1>

      <div className="grid md:grid-cols-3 gap-10">
        {/* Left: Form */}
        <div className="md:col-span-2 space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full border rounded-md px-3 py-2"
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full border rounded-md px-3 py-2"
          />
          <input
            type="tel"
            placeholder="Phone Number"
            className="w-full border rounded-md px-3 py-2"
          />
          <input
            type="date"
            placeholder="Date of Birth"
            className="w-full border rounded-md px-3 py-2"
          />
          <select className="w-full border rounded-md px-3 py-2">
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          <input
            type="text"
            placeholder="ID Number (optional)"
            className="w-full border rounded-md px-3 py-2"
          />

          <label className="flex items-center gap-2 mt-4">
            <input type="checkbox" className="h-4 w-4" />
            <span className="text-sm">
              I agree to Eventflow’s{" "}
              <a href="#" className="text-blue-600 underline">
                Terms & Conditions
              </a>
            </span>
          </label>

          <button className="mt-6 w-full bg-blue-600 text-white rounded-md h-11 hover:bg-blue-700">
            Continue to Payment
          </button>
        </div>

        {/* Right: Order Summary */}
        <div className="border rounded-lg p-4">
          <h2 className="font-semibold mb-4">Order Summary</h2>
          <div className="flex justify-between text-sm mb-2">
            <span>Regular Sale × 1</span>
            <span>AUD $75.00</span>
          </div>
          <hr className="my-2" />
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>AUD $75.00</span>
          </div>
        </div>
      </div>
    </div>
  );
}
