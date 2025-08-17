// app/checkout/step1/page.tsx
import Link from "next/link";

export default function CheckoutStep1() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Event Info */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left side */}
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-2">
            IKUZO JMusic Festival The 3rd
          </h1>
          <p className="text-gray-600 mb-4">Hosted by LENTERA ENTERTAINMENT</p>

          {/* Ticket List */}
          <div className="space-y-4">
            <div className="border rounded-lg p-4 flex items-center justify-between">
              <div>
                <p className="font-medium">Regular Sale</p>
                <p className="text-sm text-gray-500">
                  This ticket grants you access to all activities.
                </p>
                <p className="mt-1 font-semibold">AUD $75.00</p>
              </div>
              <select className="border rounded-md px-3 py-2">
                <option value="0">0</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
              </select>
            </div>
          </div>

          {/* Continue Button */}
          <div className="mt-6">
            <Link
              href="/checkout/step2"
              className="inline-flex items-center justify-center rounded-md bg-blue-600 text-white h-11 px-6 hover:bg-blue-700"
            >
              Continue to Details
            </Link>
          </div>
        </div>

        {/* Right side image */}
        <div className="flex-1">
          <img
            src="/event-banner.jpg"
            alt="Event Banner"
            className="w-full rounded-lg object-cover"
          />
        </div>
      </div>
    </div>
  );
}
