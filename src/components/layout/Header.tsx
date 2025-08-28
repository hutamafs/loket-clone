import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 md:px-2 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link href="/" className="text-2xl font-bold text-primary">
            EventFlow
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/events"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Browse Events
            </Link>
            {/* <Link
              href="/create-event"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Create Event
            </Link> */}
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/signin">Sign In</Link>
          <Link href="/signup">Sign Up</Link>
        </div>
      </div>
    </header>
  );
}
