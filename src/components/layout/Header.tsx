import Link from "next/link";
import { searchEvents } from "@/app/actions/search";

const quickTags = [
  "Promo",
  "Featured",
  "Music",
  "Family",
  "Sports",
  "Workshop",
  "Conference",
];

export default function Header() {
  return (
    <header className="fixed top-0 z-50 w-full border-b bg-[#0e3a8a] text-white">
      {/* main bar */}
      <div className="px-2 sm:px-4 lg:px-6 py-2 md:py-3">
        <div className="flex items-center gap-2 md:gap-3">
          {/* mobile hamburger via <details> (no JS) */}
          <details className="md:hidden">
            <summary className="list-none p-1.5 -ml-1 rounded hover:bg-white/10 cursor-pointer">
              <span className="sr-only">Open menu</span>
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeWidth="2"
                  strokeLinecap="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </summary>
            <div className="absolute mt-2 p-3 bg-[#0e3a8a] border border-white/20 rounded shadow-lg space-y-2 text-sm z-50">
              <Link
                href="/events"
                className="flex items-center gap-2 hover:underline font-medium py-1"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
                </svg>
                Events
              </Link>
            </div>
          </details>

          {/* Logo */}
          <Link
            href="/"
            className="font-black tracking-tight text-white text-lg md:text-xl"
          >
            EVENT<span className="opacity-80">FLOW</span>
          </Link>

          {/* Desktop search (Server Action) */}
          <div className="hidden md:flex items-center gap-2 flex-1 max-w-3xl mx-auto">
            <form
              action={searchEvents}
              className="hidden md:flex items-center gap-2 flex-1 max-w-3xl mx-auto"
            >
              <input
                name="keyword"
                aria-label="Search events"
                placeholder="Find exciting events here"
                className="w-full h-10 md:h-11 pl-3 pr-3 rounded-md bg-white text-black placeholder:text-gray-500 outline-none focus:ring-4 ring-white/30"
              />
              <button
                type="submit"
                className="h-10 md:h-11 rounded bg-white text-[#0e3a8a] px-4 font-medium hover:bg-white/90"
              >
                Search
              </button>
            </form>
          </div>

          {/* Events Link with Compass Icon for Desktop */}
          <Link
            href="/events"
            className="hidden md:flex items-center gap-1.5 hover:underline font-medium"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
            </svg>
            Events
          </Link>

          <div className="hidden md:flex items-center gap-2">
            <Link
              href="/sign-up"
              className="rounded bg-white text-[#0e3a8a] px-3 py-1.5 font-medium"
            >
              Sign up
            </Link>
            <Link
              href="/sign-in"
              className="rounded border border-white px-3 py-1.5 font-medium hover:bg-white/10"
            >
              Log in
            </Link>
          </div>

          {/* Mobile login shortcut */}
          <Link
            href="/sign-in"
            className="md:hidden ml-auto rounded border border-white px-2.5 py-1 text-sm font-medium hover:bg-white/10"
          >
            Log in
          </Link>
        </div>

        {/* Quick tags (server links) */}
        <div className="mt-2 md:mt-3 -mb-1">
          <div className="flex justify-start md:justify-center gap-1.5 md:gap-2 overflow-x-auto scrollbar-none py-1">
            {quickTags.map((t) => (
              <Link
                key={t}
                href={`/events?keyword=${encodeURIComponent(t)}`}
                className="px-2 md:px-3 py-1 md:py-1.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 text-xs whitespace-nowrap"
              >
                #{t}
              </Link>
            ))}
          </div>
        </div>

        {/* mobile search */}
        <form
          action={searchEvents}
          className="md:hidden mt-2 flex items-center gap-1"
        >
          <input
            name="keyword"
            aria-label="Search events"
            placeholder="Find exciting events here"
            className="w-full h-9 pl-3 pr-3 rounded-md bg-white text-black placeholder:text-gray-500 outline-none focus:ring-4 ring-white/30 text-sm"
          />
          {/* <select
            name="city"
            className="h-11 rounded-md bg-white text-black px-2 outline-none focus:ring-4 ring-white/30"
            defaultValue=""
            aria-label="Choose city"
          >
            <option value="" disabled>
              City
            </option>
            <option value="Melbourne">Melbourne</option>
            <option value="Sydney">Sydney</option>
            <option value="Jakarta">Jakarta</option>
            <option value="Bandung">Bandung</option>
            <option value="Bali">Bali</option>
            <option value="Surabaya">Surabaya</option>
          </select> */}
          <button
            type="submit"
            className="h-9 rounded bg-white text-[#0e3a8a] px-3 font-medium hover:bg-white/90 text-sm"
          >
            Search
          </button>
        </form>
      </div>
      {/* Add a spacer element to ensure proper scroll spacing on mobile */}
      <div className="md:hidden h-1"></div>
    </header>
  );
}
