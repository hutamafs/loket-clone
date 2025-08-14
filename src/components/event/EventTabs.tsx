"use client";

import { useState } from "react";

export default function EventTabs({
  description,
  ticketUrl,
}: {
  description: string;
  ticketUrl: string;
}) {
  const [tab, setTab] = useState<"desc" | "tickets">("desc");

  return (
    <div className="w-full">
      <div className="flex mb-4 ">
        <button
          onClick={() => setTab("desc")}
          className={`px-4 py-3 text-sm font-medium -mb-[1px] border-b-2 ${
            tab === "desc"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500"
          }`}
        >
          Description
        </button>
        <button
          onClick={() => setTab("tickets")}
          className={`px-4 py-3 text-sm font-medium -mb-[1px] border-b-2 ${
            tab === "tickets"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500"
          }`}
        >
          Tickets
        </button>
      </div>

      {tab === "desc" ? (
        <div className="prose max-w-none prose-p:leading-relaxed">
          {description ? (
            <p style={{ whiteSpace: "pre-wrap" }}>{description}</p>
          ) : (
            <p className="text-gray-600">No description provided.</p>
          )}
        </div>
      ) : (
        <div className="rounded-xl border p-4">
          <h3 className="font-semibold mb-2">Buy on Ticketmaster</h3>
          <p className="text-gray-600 mb-4">
            You’ll be redirected to the official ticketing page.
          </p>
          <a
            href={ticketUrl}
            target="_blank"
            className="inline-flex items-center justify-center rounded-md bg-blue-600 text-white h-11 px-5 hover:bg-blue-700"
          >
            See Tickets
          </a>
        </div>
      )}
    </div>
  );
}
