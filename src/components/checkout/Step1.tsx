"use client";

import Image from "next/image";
import { useState } from "react";
import { useCheckoutStore } from "@/store/checkout";
import { Event } from "@/app/types/event";

function EventCheckout({
  event,
  setStep,
}: {
  event: Event;
  setStep: (step: number) => void;
}) {
  const [quantity, setQuantity] = useState(0);
  const setQuantityGlobal = useCheckoutStore((s) => s.setQuantity);

  const price =
    event.price?.min && event.price?.min > 0 ? event.price.min : 100; // demo fallback
  const subtotal = quantity * price;

  return (
    <div
      className="flex flex-col md:flex-row w-full gap-6 p-6 md:p-20"
      style={{ minHeight: "calc(100vh - 260px)" }} // 👈 subtract navbar
    >
      {/* Banner - mobile top, desktop right */}
      <div className="w-full md:w-1/2 order-1 md:order-2">
        <Image
          src={event.image}
          alt={event.name}
          width={800}
          height={450}
          className="rounded-lg object-cover w-full h-auto"
          priority
        />
      </div>

      {/* LEFT SIDE: checkout info */}
      <div className="flex-1 space-y-6 order-2 md:order-1">
        {/* Step + title */}
        <div>
          <h2 className="text-sm text-gray-500">
            Step 1 of 3 • Select Tickets
          </h2>
          <h1 className="text-2xl font-bold">{event.name}</h1>

          {/* Host / merchant */}
          {event.organizer ? (
            <p className="text-sm text-gray-600">
              Hosted by <span className="font-medium">{event.organizer}</span>
            </p>
          ) : (
            <p className="text-sm text-gray-600">Hosted via Ticketmaster</p>
          )}

          <p className="text-sm text-gray-500">{event.venue?.name}</p>
        </div>

        {/* Tickets */}
        <div className="border rounded-lg p-4 space-y-4 bg-white">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">{event.name}</p>
              <p className="text-gray-500 text-sm">
                {event.price?.display ?? "Price TBA"}
              </p>
            </div>

            {quantity === 0 ? (
              <button
                onClick={() => setQuantity(1)}
                className="px-4 py-2 border rounded-lg bg-white hover:bg-gray-50"
              >
                Select
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQuantity(0)}
                  className="p-2 bg-red-100 rounded-lg hover:bg-red-200"
                >
                  🗑️
                </button>
                <select
                  value={quantity}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    setQuantity(v);
                    setQuantityGlobal(v);
                  }}
                  className="border rounded-lg px-2 py-1"
                >
                  {[...Array(10)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <p className="text-xs text-gray-400">
            Last Chance to Buy:{" "}
            {new Date(event.start).toLocaleDateString("en-AU", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}{" "}
            {new Date(event.start).toLocaleTimeString("en-AU", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>

        {/* Payment methods */}
        <div className="flex gap-4 items-center">
          <p className="text-sm text-gray-600">Available Payment Method:</p>
          <Image
            src="/images/payment/stripe.webp"
            alt="Stripe"
            width={60}
            height={30}
          />
        </div>
      </div>

      {/* Sticky bottom bar - only visible if ticket ordered */}
      {quantity > 0 && (
        <div className="fixed bottom-0 left-0 w-full bg-white border-t shadow-lg px-4 py-3 flex justify-between items-center md:hidden">
          <div>
            <p className="text-sm text-gray-600">
              Subtotal ({quantity} ticket{quantity > 1 && "s"})
            </p>
            <p className="font-semibold">${subtotal.toLocaleString("en-AU")}</p>
          </div>
          <button
            onClick={() => {
              setQuantityGlobal(quantity);
              setStep(2);
            }}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Order Now
          </button>
        </div>
      )}

      {/* Desktop bottom bar */}
      {quantity > 0 && (
        <div className="hidden md:flex fixed bottom-0 left-0 w-full bg-white border-t shadow-lg px-20 py-4 justify-between items-center">
          <div>
            <p className="text-sm text-gray-600">
              Subtotal ({quantity} ticket{quantity > 1 && "s"})
            </p>
            <p className="font-semibold">${subtotal.toLocaleString("en-AU")}</p>
          </div>
          <button
            onClick={() => {
              setQuantityGlobal(quantity);
              setStep(2);
            }}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700"
          >
            Order Now
          </button>
        </div>
      )}
    </div>
  );
}

export default EventCheckout;
