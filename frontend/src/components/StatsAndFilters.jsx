import React from "react";
import { Badge } from "./ui/badge";
import { FilterType } from "@/lib/data";
import { Filter, Timer } from "lucide-react";
import { Button } from "./ui/button";

const StatsAndFilters = ({ completedTasksCount = 0, activeTasksCount = 0, pomodoroCount = 0, filter = "all", setFilter }) => {
  return (
    <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
      {/* phần thống kê */}
      <div className="flex gap-2">
        <Badge
          variant="secondary"
          className="bg-white/50 text-accent-foreground border-info/20 px-1.5 py-0.5 text-[11px]"
        >
          {activeTasksCount} {FilterType.active}
        </Badge>
        <Badge
          variant="secondary"
          className="bg-white/50 text-success border-success/20 px-1.5 py-0.5 text-[11px]"
        >
          {completedTasksCount} {FilterType.completed}
        </Badge>
        <Badge variant="secondary" className="bg-white/50 text-primary border-primary/20 px-1.5 py-0.5 text-[11px]">
          <Timer className="size-3" /> {pomodoroCount}
        </Badge>
      </div>

      {/* phần filter */}
      <div className="flex flex-col gap-1.5 sm:flex-row">
        {Object.keys(FilterType).map((type) => (
          <Button
            key={type}
            variant={filter === type ? "gradient" : "ghost"}
            size="sm"
            className="capitalize px-2 text-xs h-8"
            onClick={() => setFilter(type)}
          >
            <Filter className="size-3.5" />
            {FilterType[type]}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default StatsAndFilters;
