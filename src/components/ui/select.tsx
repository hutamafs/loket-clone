// Placeholder select – not full-featured shadcn implementation yet.
"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

interface SelectContextValue {
  value: string | undefined;
  setValue: (v: string) => void;
  open: boolean;
  setOpen: (o: boolean) => void;
}
const SelectCtx = React.createContext<SelectContextValue | null>(null);

interface SelectProps {
  value?: string;
  onValueChange?: (v: string) => void;
  children: React.ReactNode;
}
export function Select({
  value: valueProp,
  onValueChange,
  children,
}: SelectProps) {
  const [internal, setInternal] = React.useState<string | undefined>(valueProp);
  const [open, setOpen] = React.useState(false);
  React.useEffect(() => {
    if (valueProp !== undefined) setInternal(valueProp);
  }, [valueProp]);
  function setValue(v: string) {
    if (onValueChange) onValueChange(v);
    if (valueProp === undefined) setInternal(v);
    setOpen(false);
  }
  // close on escape
  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);
  // outside click
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  React.useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);
  return (
    <SelectCtx.Provider value={{ value: internal, setValue, open, setOpen }}>
      <div ref={rootRef} className="relative">
        {children}
      </div>
    </SelectCtx.Provider>
  );
}

export function SelectTrigger({
  className,
  ...props
}: React.HTMLAttributes<HTMLButtonElement>) {
  const ctx = React.useContext<SelectContextValue | null>(SelectCtx);
  return (
    <button
      type="button"
      className={cn(
        "flex w-full items-center justify-between rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring",
        className
      )}
      onClick={() => ctx?.setOpen(!ctx.open)}
      {...props}
    >
      <span className="truncate text-left">{ctx?.value || "Select"}</span>
      <span
        className={cn(
          "ml-2 transition-transform opacity-50",
          ctx?.open && "rotate-180"
        )}
      >
        ▾
      </span>
    </button>
  );
}

export function SelectValue({ placeholder }: { placeholder?: string }) {
  const ctx = React.useContext<SelectContextValue | null>(SelectCtx);
  return (
    <span className="text-sm text-muted-foreground">
      {ctx?.value || placeholder || "Select"}
    </span>
  );
}

export function SelectContent({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const ctx = React.useContext<SelectContextValue | null>(SelectCtx);
  if (!ctx?.open) return null;
  return (
    <div
      className={cn(
        "absolute z-50 mt-1 w-full rounded-md border bg-popover p-1 shadow animate-in fade-in-0 zoom-in-95",
        className
      )}
    >
      {children}
    </div>
  );
}

interface SelectItemProps {
  value: string;
  children: React.ReactNode;
}
export function SelectItem({ value, children }: SelectItemProps) {
  const ctx = React.useContext<SelectContextValue | null>(SelectCtx);
  return (
    <div
      onClick={() => ctx?.setValue(value)}
      className={cn(
        "cursor-pointer select-none rounded-sm px-2 py-1 text-sm hover:bg-accent hover:text-accent-foreground",
        ctx?.value === value && "bg-accent text-accent-foreground"
      )}
      role="option"
      aria-selected={ctx?.value === value}
    >
      {children}
    </div>
  );
}
