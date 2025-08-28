"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, User, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MobileMenuProps {
  user?: { email: string } | null;
}

export default function MobileMenu({ user }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => document.body.classList.remove("overflow-hidden");
  }, [isOpen]);

  return (
    <>
      <button
        onClick={toggleMenu}
        className="p-2 hover:bg-gray-100 rounded-full transition-colors md:hidden"
        aria-label="Toggle menu"
      >
        <Menu className="h-6 w-6" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={closeMenu} />
          <div className="absolute inset-0 bg-white flex flex-col">
            <div className="flex items-center justify-between p-4 border-b bg-white sticky top-0 z-10">
              <Link
                href="/"
                className="text-xl font-bold text-primary"
                onClick={closeMenu}
              >
                EventFlow
              </Link>
              <button
                onClick={closeMenu}
                className="p-2 hover:bg-gray-100 rounded-full"
                aria-label="Close menu"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="overflow-y-auto p-4 space-y-6">
              {/* Auth Section */}
              {!user ? (
                <div className="space-y-3">
                  <Link href="/signin" onClick={closeMenu}>
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full bg-transparent"
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/signup" onClick={closeMenu}>
                    <Button size="lg" className="w-full">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">Welcome back!</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="space-y-2">
                <Link
                  href="/events"
                  className="flex items-center space-x-3 p-4 rounded-lg hover:bg-gray-50"
                  onClick={closeMenu}
                >
                  <span className="text-2xl">🎫</span>
                  <span className="font-medium text-lg">Browse Events</span>
                </Link>

                {/* <Link
                  href="/map"
                  className="flex items-center space-x-3 p-4 rounded-lg hover:bg-gray-50"
                  onClick={closeMenu}
                >
                  <span className="text-2xl">🗺️</span>
                  <span className="font-medium text-lg">Map View</span>
                </Link> */}

                <Link
                  href="/checkout/1"
                  className="flex items-center space-x-3 p-4 rounded-lg hover:bg-gray-50"
                  onClick={closeMenu}
                >
                  <ShoppingCart className="h-6 w-6 text-gray-600" />
                  <span className="font-medium text-lg">Cart</span>
                </Link>

                {user && (
                  <Link
                    href="/me"
                    className="flex items-center space-x-3 p-4 rounded-lg hover:bg-gray-50"
                    onClick={closeMenu}
                  >
                    <User className="h-6 w-6 text-gray-600" />
                    <span className="font-medium text-lg">Profile</span>
                  </Link>
                )}
              </div>

              {user && (
                <div className="pt-6 border-t">
                  <form
                    action="/api/signout"
                    method="post"
                    onSubmit={closeMenu}
                    className="w-full"
                  >
                    <Button
                      variant="ghost"
                      size="lg"
                      className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                      type="submit"
                    >
                      Sign Out
                    </Button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
