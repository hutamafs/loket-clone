"use client";

import { Button } from "@/components/ui/button";

interface EventPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
}

export function EventPagination({
  page,
  totalPages,
  onPageChange,
}: EventPaginationProps) {
  return (
    <div className="flex justify-center items-center gap-4 mt-8">
      <Button
        variant="outline"
        disabled={page <= 0}
        onClick={() => onPageChange(page - 1)}
      >
        Previous
      </Button>

      <span className="text-sm text-muted-foreground">
        Page {page + 1} of {totalPages}
      </span>

      <Button
        variant="outline"
        disabled={page >= totalPages - 1}
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </Button>
    </div>
  );
}
