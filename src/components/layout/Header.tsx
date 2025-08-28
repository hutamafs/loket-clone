import Link from "next/link";
import { getSessionUser } from "@/lib/auth/server";
import { ShoppingCart, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import MobileMenu from "./mobile-menu";

interface HeaderProps {
  user?: {
    email: string;
  } | null;
}

export default async function Header({ user }: HeaderProps) {
  const raw = user || (await getSessionUser());
  const resolvedUser = raw && raw.email ? { email: raw.email } : null;
  return (
    <header className="border-b sticky top-0 z-50 bg-white md:bg-white/95 md:backdrop-blur supports-[backdrop-filter]:md:bg-white/60 shadow-sm">
      <div className="container mx-auto px-4 md:px-2 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-8">
          <Link href="/" className="text-2xl font-bold text-primary">
            EventFlow
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/events"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Browse Events
            </Link>
            {/* <Link
              href="/map"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Map View
            </Link> */}
          </nav>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-4">
          {/* Cart Icon */}
          <Link
            href="/checkout/1"
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ShoppingCart className="h-5 w-5" />
          </Link>

          {resolvedUser ? (
            <>
              {/* Profile Icon */}
              <Link
                href="/me"
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <User className="h-5 w-5" />
              </Link>

              {/* User Email */}
              <span className="text-sm text-gray-600">
                {resolvedUser.email}
              </span>

              {/* Sign Out */}
              <form action="/api/signout" method="post">
                <Button variant="ghost" size="sm" type="submit">
                  Sign Out
                </Button>
              </form>
            </>
          ) : (
            <>
              <Link href="/signin">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">Sign Up</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu - Cart + Burger */}
        <div className="md:hidden flex items-center space-x-2">
          {/* Cart Icon - Always visible on mobile */}
          <Link
            href="/checkout/1"
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ShoppingCart className="h-5 w-5" />
          </Link>

          <MobileMenu user={resolvedUser} />
        </div>
      </div>
    </header>
  );
}
