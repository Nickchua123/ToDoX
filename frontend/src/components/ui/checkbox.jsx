import * as React from "react";
import { cn } from "@/lib/utils";

function Checkbox({ className, checked, defaultChecked, onCheckedChange, ...props }) {
  const [internal, setInternal] = React.useState(!!defaultChecked);
  const isControlled = typeof checked !== "undefined";
  const value = isControlled ? checked : internal;

  const handleChange = (e) => {
    const next = e.target.checked;
    if (!isControlled) setInternal(next);
    if (typeof onCheckedChange === "function") onCheckedChange(next);
  };

  return (
    <input
      type="checkbox"
      data-slot="checkbox"
      className={cn(
        "h-4 w-4 rounded border border-input text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
        className
      )}
      checked={value}
      onChange={handleChange}
      {...props}
    />
  );
}

export { Checkbox };

