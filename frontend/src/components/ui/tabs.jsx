import * as React from "react";
import { cn } from "@/lib/utils";

const TabsContext = React.createContext(null);

function Tabs({ value, defaultValue, onValueChange, children }) {
  const isControlled = typeof value !== "undefined";
  const [internal, setInternal] = React.useState(defaultValue ?? "");
  const current = isControlled ? value : internal;

  const setValue = (v) => {
    if (!isControlled) setInternal(v);
    onValueChange?.(v);
  };

  const ctx = React.useMemo(() => ({ value: current, setValue }), [current]);
  return <TabsContext.Provider value={ctx}>{children}</TabsContext.Provider>;
}

function useTabs() {
  const ctx = React.useContext(TabsContext);
  if (!ctx) throw new Error("Tabs subcomponents must be used within <Tabs>");
  return ctx;
}

function TabsList({ className, children, ...props }) {
  return (
    <div
      role="tablist"
      data-slot="tabs-list"
      className={cn(className)}
      {...props}
    >
      {children}
    </div>
  );
}

function TabsTrigger({ className, value, children, ...props }) {
  const { value: current, setValue } = useTabs();
  const active = String(current) === String(value);
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      data-state={active ? "active" : "inactive"}
      data-slot="tabs-trigger"
      className={cn("outline-none", className)}
      onClick={() => setValue(value)}
      {...props}
    >
      {children}
    </button>
  );
}

export { Tabs, TabsList, TabsTrigger };

