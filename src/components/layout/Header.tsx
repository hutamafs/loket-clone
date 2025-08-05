import Link from "next/link";

export function Header() {
  return (
    <header className="px-6 py-4 border-b flex justify-between items-center">
      <Link href="/" className="text-xl font-bold">
        EventFlow
      </Link>
      <nav>
        <Link
          href="/events"
          className="text-muted-foreground hover:text-foreground"
        >
          Events
        </Link>
      </nav>
    </header>
  );
}
