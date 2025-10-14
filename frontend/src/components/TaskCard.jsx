import React, { useState } from "react";
import { Card } from "./ui/card";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Calendar, CheckCircle2, Circle, SquarePen, Trash2, Timer } from "lucide-react";
import { usePomodoro } from "@/components/pomodoro/PomodoroContext";
import { Input } from "./ui/input";
import api from "@/lib/axios";
import { toast } from "sonner";

const TaskCard = ({ task, index, handleTaskChanged, pomodoroCount = 0, compact = false }) => {
  const [isEditting, setIsEditting] = useState(false);
  const [updateTaskTitle, setUpdateTaskTitle] = useState(task.title || "");
  const { start } = usePomodoro();

  const viewerOnly = () => toast.error("Bạn chỉ có quyền xem trong dự án này");

  const deleteTask = async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      toast.success("Nhiệm vụ đã xóa.");
      handleTaskChanged();
    } catch (error) {
      const status = error?.response?.status;
      if (status === 403) return viewerOnly();
      toast.error("Lỗi khi xóa nhiệm vụ.");
    }
  };

  const updateTask = async () => {
    try {
      setIsEditting(false);
      await api.put(`/tasks/${task._id}`, { title: updateTaskTitle });
      toast.success(`Đã đổi thành "${updateTaskTitle}"`);
      handleTaskChanged();
    } catch (error) {
      const status = error?.response?.status;
      if (status === 403) return viewerOnly();
      toast.error("Lỗi khi cập nhật nhiệm vụ.");
    }
  };

  const toggleTaskCompleteButton = async () => {
    try {
      if (task.status === "active") {
        await api.put(`/tasks/${task._id}`, { status: "complete", completedAt: new Date().toISOString() });
        toast.success(`${task.title} đã hoàn thành.`);
      } else {
        await api.put(`/tasks/${task._id}`, { status: "active", completedAt: null });
        toast.success(`${task.title} đã chuyển sang chưa hoàn thành.`);
      }
      handleTaskChanged();
    } catch (error) {
      const status = error?.response?.status;
      if (status === 403) return viewerOnly();
      toast.error("Lỗi khi cập nhật nhiệm vụ.");
    }
  };

  const handleKeyPress = (event) => { if (event.key === "Enter") updateTask(); };

  return (
    <Card
      className={cn(
        `${compact ? "p-3" : "p-4"} bg-gradient-card border-0 shadow-custom-md hover:shadow-custom-lg transition-all duration-200 animate-fade-in group`,
        task.status === "complete" && "opacity-75"
      )}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className={cn("flex items-center", compact ? "gap-3" : "gap-4")}>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            compact ? "flex-shrink-0 size-7 rounded-full transition-all duration-200" : "flex-shrink-0 size-8 rounded-full transition-all duration-200",
            task.status === "complete" ? "text-success hover:text-success/80" : "text-muted-foreground hover:text-primary"
          )}
          onClick={toggleTaskCompleteButton}
        >
          {task.status === "complete" ? <CheckCircle2 className={cn(compact ? "size-4" : "size-5")} /> : <Circle className={cn(compact ? "size-4" : "size-5")} />}
        </Button>

        <div className="flex-1 min-w-0">
          {isEditting ? (
            <Input
              placeholder="Cần phải làm gì?"
              className={cn("flex-1 border-border/50 focus:border-primary/50 focus:ring-primary/20", compact ? "h-10 text-sm" : "h-12 text-base")}
              type="text"
              value={updateTaskTitle}
              onChange={(e) => setUpdateTaskTitle(e.target.value)}
              onKeyPress={handleKeyPress}
              onBlur={() => { setIsEditting(false); setUpdateTaskTitle(task.title || ""); }}
            />
          ) : (
            <p className={cn(compact ? "text-sm" : "text-base", "transition-all duration-200", task.status === "complete" ? "line-through text-muted-foreground" : "text-foreground")}>{task.title}</p>
          )}

          <div className={cn("flex items-center mt-1", compact ? "gap-1.5" : "gap-2")}> 
            <Calendar className={cn("text-muted-foreground", compact ? "size-3" : "size-3")} />
            <span className={cn(compact ? "text-[11px]" : "text-xs", "text-muted-foreground")}>{new Date(task.createdAt).toLocaleString()}</span>
            <span className="text-xs text-muted-foreground"> - </span>
            <Timer className={cn("text-muted-foreground", compact ? "size-3" : "size-3")} />
            <span className={cn(compact ? "text-[11px]" : "text-xs", "text-muted-foreground")}>{pomodoroCount}</span>
            {task.completedAt && (
              <>
                <span className="text-xs text-muted-foreground"> - </span>
                <Calendar className={cn("text-muted-foreground", compact ? "size-3" : "size-3")} />
                <span className={cn(compact ? "text-[11px]" : "text-xs", "text-muted-foreground")}>{new Date(task.completedAt).toLocaleString()}</span>
              </>
            )}
          </div>
        </div>

        <div className={cn("hidden group-hover:inline-flex animate-slide-up", compact ? "gap-1.5" : "gap-2")}>
          <Button
            variant="ghost"
            size="icon"
            className={cn("flex-shrink-0 transition-colors text-muted-foreground hover:text-primary", compact ? "size-7" : "size-8")}
            title="Focus task"
            onClick={() => start(task._id, task.title)}
          >
            <Timer className={cn(compact ? "size-3.5" : "size-4")} />
          </Button>
          <Button variant="ghost" size="icon" className={cn("flex-shrink-0 transition-colors text-muted-foreground hover:text-info", compact ? "size-7" : "size-8")} onClick={() => { setIsEditting(true); setUpdateTaskTitle(task.title || ""); }}>
            <SquarePen className={cn(compact ? "size-3.5" : "size-4")} />
          </Button>
          <Button variant="ghost" size="icon" className={cn("flex-shrink-0 transition-colors text-muted-foreground hover:text-destructive", compact ? "size-7" : "size-8")} onClick={() => deleteTask(task._id)}>
            <Trash2 className={cn(compact ? "size-3.5" : "size-4")} />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default TaskCard;

