import * as React from "react";
import { cn } from "@/lib/utils";

const SelectContext = React.createContext(null);

function Select({ value, defaultValue, onValueChange, children }) {
  const [open, setOpen] = React.useState(false);
  const [internal, setInternal] = React.useState(defaultValue ?? "");
  const isControlled = typeof value !== "undefined";
  const current = isControlled ? value : internal;

  const setValue = React.useCallback(
    (v) => {
      if (!isControlled) setInternal(v);
      onValueChange?.(v);
    },
    [isControlled, onValueChange]
  );

  const ctx = React.useMemo(() => ({ open, setOpen, value: current, setValue }), [open, current, setValue]);
  return <SelectContext.Provider value={ctx}>{children}</SelectContext.Provider>;
}

function useSelectCtx() {
  const ctx = React.useContext(SelectContext);
  if (!ctx) throw new Error("Select subcomponents must be used within <Select>");
  return ctx;
}

function SelectTrigger({ className, children, ...props }) {
  const { open, setOpen } = useSelectCtx();
  return (
    <button
      type="button"
      data-slot="select-trigger"
      aria-haspopup="listbox"
      aria-expanded={open}
      onClick={() => setOpen(!open)}
      className={cn(
        "flex h-9 w-full items-center justify-between rounded-md border bg-background px-3 text-sm",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

function SelectValue({ placeholder }) {
  const { value } = useSelectCtx();
  return (
    <span data-slot="select-value" className="truncate text-left">
      {value || placeholder || ""}
    </span>
  );
}

function SelectContent({ className, children }) {
  const { open } = useSelectCtx();
  if (!open) return null;
  return (
    <div
      data-slot="select-content"
      className={cn(
        "mt-2 w-full rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
        className
      )}
      role="listbox"
    >
      {children}
    </div>
  );
}

function SelectItem({ className, value, children }) {
  const { value: current, setValue, setOpen } = useSelectCtx();
  const isActive = current === value;
  return (
    <div
      data-slot="select-item"
      role="option"
      aria-selected={isActive}
      tabIndex={0}
      onClick={() => {
        setValue(String(value));
        setOpen(false);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setValue(String(value));
          setOpen(false);
        }
      }}
      className={cn(
        "cursor-pointer select-none rounded-sm px-2 py-1.5 text-sm outline-none",
        isActive ? "bg-accent text-accent-foreground" : "hover:bg-accent hover:text-accent-foreground",
        className
      )}
    >
      {children}
    </div>
  );
}

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem };

