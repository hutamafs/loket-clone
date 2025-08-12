import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/70 backdrop-blur border-b px-6 py-4 flex justify-between items-center">
      <Link href="/" className="text-xl font-bold">
        EventFlow
      </Link>
      <nav className="space-x-4 text-sm">
        <Link href="/events">Events</Link>
        <Link href="/events/map">Map</Link>
        <Link href="/profile">Profile</Link>
      </nav>
    </header>
  );
}
