import React, { useState } from "react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/axios";

const AddTask = ({ handleNewTaskAdded, projectId = null, compact = false }) => {
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const addTask = async () => {
    const title = newTaskTitle.trim();
    if (!title) {
      toast.error("Bạn cần nhập nội dung nhiệm vụ.");
      return;
    }
    try {
      await api.post("/tasks", { title, projectId });
      toast.success(`Nhiệm vụ "${title}" đã được thêm.`);
      handleNewTaskAdded();
    } catch (error) {
      const status = error?.response?.status;
      if ((status === 403 || status === 404) && projectId) {
        toast.error("Bạn chỉ có quyền xem trong dự án này");
      } else {
        toast.error("Lỗi khi thêm nhiệm vụ mới.");
      }
    } finally {
      setNewTaskTitle("");
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") addTask();
  };

  return (
    <Card className={`${compact ? "p-4" : "p-6"} border-0 bg-gradient-card shadow-custom-lg`}>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          type="text"
          placeholder="Cần phải làm gì?"
          className={`${compact ? "h-10 text-sm" : "h-12 text-base"} bg-slate-50 sm:flex-1 border-border/50 focus:border-primary/50 focus:ring-primary/20`}
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <Button
          variant="gradient"
          size={compact ? "lg" : "xl"}
          className={compact ? "px-4" : "px-6"}
          onClick={addTask}
          disabled={!newTaskTitle.trim()}
        >
          <Plus className="size-5" />
          Thêm
        </Button>
      </div>
    </Card>
  );
};

export default AddTask;

