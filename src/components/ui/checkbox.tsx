import * as React from "react";
import { cn } from "@/lib/utils";

export function Checkbox({
  className,
  checked,
  onCheckedChange,
  ...props
}: {
  className?: string;
  checked?: boolean;
  onCheckedChange?: (c: boolean) => void;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type="checkbox"
      className={cn("h-4 w-4 rounded border border-input", className)}
      checked={checked}
      onChange={(e) => onCheckedChange?.(e.target.checked)}
      {...props}
    />
  );
}
