"use client";
import { Button } from "@/components/ui/button";
import { Heart, Share2 } from "lucide-react";
import { useState } from "react";

export default function EventActions() {
  const [isFavorited, setIsFavorited] = useState(false);
  return (
    <div className="flex items-center gap-2 shrink-0">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsFavorited((v) => !v)}
        className="h-9 w-9 p-0"
      >
        <Heart
          className={`h-4 w-4 ${
            isFavorited ? "fill-red-500 text-red-500" : ""
          }`}
        />
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="h-9 w-9 p-0 bg-transparent"
      >
        <Share2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
