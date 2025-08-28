import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t py-6 text-sm text-muted-foreground">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 px-4">
        <p>&copy; {new Date().getFullYear()} EventFlow. All rights reserved.</p>
        <div className="flex gap-4">
          <Link href="/about" className="hover:underline">
            About
          </Link>
          <Link href="/contact" className="hover:underline">
            Contact
          </Link>
          <Link href="/terms" className="hover:underline">
            Terms
          </Link>
        </div>
      </div>
    </footer>
  );
}
