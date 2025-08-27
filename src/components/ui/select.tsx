// Placeholder select – not full-featured shadcn implementation yet.
"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

interface SelectContextValue {
  value: string | undefined;
  setValue: (v: string) => void;
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
  React.useEffect(() => {
    if (valueProp !== undefined) setInternal(valueProp);
  }, [valueProp]);
  function setValue(v: string) {
    if (onValueChange) onValueChange(v);
    if (valueProp === undefined) setInternal(v);
  }
  return (
    <SelectCtx.Provider value={{ value: internal, setValue }}>
      <div className="relative">{children}</div>
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
        "flex w-full items-center justify-between rounded-md border bg-background px-3 py-2 text-sm",
        className
      )}
      {...props}
    >
      <span className="truncate text-left">{ctx?.value || "Select"}</span>
      <span className="ml-2 opacity-50">▾</span>
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
  return (
    <div
      className={cn(
        "absolute z-10 mt-1 w-full rounded-md border bg-popover p-1 shadow",
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
        ctx?.value === value && "bg-accent"
      )}
    >
      {children}
    </div>
  );
}
