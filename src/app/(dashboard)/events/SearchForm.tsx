"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";

export default function SearchForm({ defaultKeyword = "" }) {
  const router = useRouter();
  const [keyword, setKeyword] = useState(defaultKeyword);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Get all current URL params and update only the keyword
    const url = new URL(window.location.href);
    const searchParams = url.searchParams;

    if (keyword) {
      searchParams.set("keyword", keyword);
    } else {
      searchParams.delete("keyword");
    }

    // Reset to page 0 when searching
    searchParams.set("page", "0");

    // Navigate to the new URL
    router.push(`/events?${searchParams.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
      <input
        type="text"
        placeholder="Search events, venues, or categories..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </form>
  );
}
