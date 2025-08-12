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
    <header className="sticky top-0 z-50 border-b bg-[#0e3a8a] text-white">
      {/* top bar (desktop) */}
      <div className="hidden md:flex items-center justify-between px-4 lg:px-6 h-10 text-xs bg-[#0b2d6a]">
        <nav className="flex items-center gap-4 opacity-90">
          <Link href="/create" className="hover:underline">
            Become an Event Creator
          </Link>
          <Link href="/pricing" className="hover:underline">
            Pricing
          </Link>
          {/* <Link href="/blog" className="hover:underline">
            Blog
          </Link>
          <Link href="/help" className="hover:underline">
            Help Center
          </Link> */}
        </nav>
        <div className="flex items-center gap-2">
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
      </div>

      {/* main bar */}
      <div className="px-4 lg:px-6 py-3">
        <div className="flex items-center gap-3">
          {/* mobile hamburger via <details> (no JS) */}
          <details className="md:hidden">
            <summary className="list-none p-2 -ml-1 rounded hover:bg-white/10 cursor-pointer">
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
            <div className="mt-2 space-y-2 text-sm">
              <Link href="/create" className="block hover:underline">
                Become an Event Creator
              </Link>
              <Link href="/pricing" className="block hover:underline">
                Pricing
              </Link>
              {/* <Link href="/blog" className="block hover:underline">
                Blog
              </Link>
              <Link href="/help" className="block hover:underline">
                Help Center
              </Link> */}
              <div className="flex gap-2 pt-1">
                <Link
                  href="/sign-up"
                  className="flex-1 text-center rounded bg-white text-[#0e3a8a] px-3 py-2 font-medium"
                >
                  Sign up
                </Link>
                <Link
                  href="/sign-in"
                  className="flex-1 text-center rounded border border-white px-3 py-2 font-medium hover:bg-white/10"
                >
                  Log in
                </Link>
              </div>
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
          <form
            action={searchEvents}
            className="hidden md:flex items-center gap-2 flex-1 max-w-3xl mx-auto"
          >
            <input
              name="keyword"
              aria-label="Search events"
              placeholder="Find exciting events here"
              className="w-full h-11 pl-3 pr-3 rounded-md bg-white text-black placeholder:text-gray-500 outline-none focus:ring-4 ring-white/30"
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
              className="h-11 rounded bg-white text-[#0e3a8a] px-4 font-medium hover:bg-white/90"
            >
              Search
            </button>
          </form>

          {/* Mobile login shortcut */}
          <Link
            href="/sign-in"
            className="md:hidden ml-auto rounded border border-white px-3 py-1.5 text-sm font-medium hover:bg-white/10"
          >
            Log in
          </Link>
        </div>

        {/* Quick tags (server links) */}
        <div className="mt-3 -mb-1">
          <div className="flex justify-center gap-2 overflow-x-auto scrollbar-none py-1">
            {quickTags.map((t) => (
              <Link
                key={t}
                href={`/?keyword=${encodeURIComponent(t)}`}
                className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 text-xs whitespace-nowrap"
              >
                #{t}
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile search (also Server Action) */}
        <form
          action={searchEvents}
          className="md:hidden mt-3 flex items-center gap-2"
        >
          <input
            name="keyword"
            aria-label="Search events"
            placeholder="Find exciting events here"
            className="w-full h-11 pl-3 pr-3 rounded-md bg-white text-black placeholder:text-gray-500 outline-none focus:ring-4 ring-white/30"
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
            className="h-11 rounded bg-white text-[#0e3a8a] px-4 font-medium hover:bg-white/90"
          >
            Go
          </button>
        </form>
      </div>
    </header>
  );
}
