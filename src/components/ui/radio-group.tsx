import * as React from "react";

interface RadioGroupProps {
  onValueChange: (v: string) => void;
  children: React.ReactNode;
  name?: string;
  className?: string;
}

export function RadioGroup({
  onValueChange,
  children,
  name = "radio-group",
  className,
}: RadioGroupProps) {
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.name === name) onValueChange(e.target.value);
  }
  return (
    <div className={className} onChange={handleChange}>
      {children}
    </div>
  );
}

interface RadioGroupItemProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  value: string;
  id: string;
}

export function RadioGroupItem({
  value,
  id,
  className,
  name,
  ...props
}: RadioGroupItemProps & { name?: string }) {
  return (
    <input
      type="radio"
      id={id}
      value={value}
      name={name}
      className={
        "h-4 w-4 border border-input rounded-full " + (className || "")
      }
      {...props}
    />
  );
}
RadioGroupItem.displayName = "RadioGroupItem";
