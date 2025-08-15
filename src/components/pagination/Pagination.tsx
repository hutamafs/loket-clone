"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

interface EventPaginationProps {
  page: number;
  totalPages: number;
  onPageChange?: (newPage: number) => void; // Optional now
  currentQueryParams?: Record<string, string>; // Optional for backward compatibility
}

export function EventPagination({
  page,
  totalPages,
  onPageChange,
  currentQueryParams = {},
}: EventPaginationProps) {
  // Generate URL for pagination with current query params
  const generatePageUrl = (pageNum: number) => {
    const params = new URLSearchParams(currentQueryParams);
    params.set("page", String(pageNum));
    return `/events?${params.toString()}`;
  };

  return (
    <div className="flex justify-center items-center gap-4 mt-8">
      {onPageChange ? (
        // Client-side navigation mode (backward compatibility)
        <Button
          variant="outline"
          disabled={page <= 0}
          onClick={() => onPageChange(page - 1)}
        >
          Previous
        </Button>
      ) : (
        // Server-side navigation mode
        <Link href={page > 0 ? generatePageUrl(page - 1) : "#"} passHref>
          <Button variant="outline" disabled={page <= 0}>
            Previous
          </Button>
        </Link>
      )}

      <span className="text-sm text-muted-foreground">
        Page {page + 1} of {totalPages}
      </span>

      {onPageChange ? (
        // Client-side navigation mode (backward compatibility)
        <Button
          variant="outline"
          disabled={page >= totalPages - 1}
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </Button>
      ) : (
        // Server-side navigation mode
        <Link
          href={page < totalPages - 1 ? generatePageUrl(page + 1) : "#"}
          passHref
        >
          <Button variant="outline" disabled={page >= totalPages - 1}>
            Next
          </Button>
        </Link>
      )}
    </div>
  );
}
