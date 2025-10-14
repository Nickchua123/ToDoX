import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { toast } from "sonner";
import api from "@/lib/axios";
import AddTask from "@/components/AddTask";
import DateTimeFilter from "@/components/DateTimeFilter";
import Footer from "@/components/Footer";
import StatsAndFilters from "@/components/StatsAndFilters";
import TaskList from "@/components/TaskList";
import TaskListPagination from "@/components/TaskListPagination";
import { visibleTaskLimit } from "@/lib/data";

const ProjectTodos = () => {
  const { projectId } = useParams();

  const [taskBuffer, setTaskBuffer] = useState([]);
  const [activeTaskCount, setActiveTaskCount] = useState(0);
  const [completeTaskCount, setCompleteTaskCount] = useState(0);
  const [filter, setFilter] = useState("all");
  const [dateQuery, setDateQuery] = useState("today");
  const [page, setPage] = useState(1);
  const [projectName, setProjectName] = useState("");
  const [pomodoroCounts, setPomodoroCounts] = useState({});
  const [pomodoroTotal, setPomodoroTotal] = useState(0);

  useEffect(() => {
    if (!projectId) return;
    fetchTasks();
  }, [projectId, dateQuery]);

  useEffect(() => {
    if (!projectId) return;
    // Subscribe SSE for realtime task changes
    try {
      const base = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/?api$/, "");
      const es = new EventSource(`${base}/api/events`, { withCredentials: true });
      const onAny = (ev) => {
        try {
          const data = JSON.parse(ev.data || "{}");
          if (!data || (data.projectId && String(data.projectId) !== String(projectId))) return;
          fetchTasks();
        } catch {}
      };
      es.addEventListener("task_changed", onAny);
      // Fallback generic message handler
      es.onmessage = () => {};
      return () => {
        try { es.removeEventListener("task_changed", onAny); es.close(); } catch {}
      };
    } catch {}
  }, [projectId, dateQuery]);

  useEffect(() => {
    if (!projectId) return;
    const handler = () => fetchTasks();
    window.addEventListener("tasks:refresh", handler);
    return () => window.removeEventListener("tasks:refresh", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId, dateQuery]);

  useEffect(() => {
    setPage(1);
  }, [filter, dateQuery]);

  useEffect(() => {
    if (!projectId) return;
    (async () => {
      try {
        const res = await api.get(`/projects/${projectId}`);
        setProjectName(res.data?.name || "");
      } catch {
        setProjectName("");
      }
    })();
  }, [projectId]);

  const fetchTasks = async () => {
    if (!projectId) return;
    try {
      const res = await api.get(`/tasks?filter=${dateQuery}&projectId=${projectId}`);
      setTaskBuffer(res.data.tasks);
      setActiveTaskCount(res.data.activeCount);
      setCompleteTaskCount(res.data.completeCount);
      const ids = (res.data.tasks || []).map((t) => t._id).join(",");
      if (ids) {
        const [countsRes, statsRes] = await Promise.all([
          api.get(`/pomodoro/task-counts?taskIds=${ids}&range=${dateQuery}`),
          api.get(`/pomodoro/stats?range=${dateQuery}&projectId=${projectId}`),
        ]);
        setPomodoroCounts(countsRes.data || {});
        setPomodoroTotal(statsRes.data?.focusCount || 0);
      } else {
        setPomodoroCounts({});
        setPomodoroTotal(0);
      }
    } catch (error) {
      console.error("Lá»—i khi táº£i tasks:", error);
      toast.error("KhÃ´ng thá»ƒ táº£i danh sÃ¡ch cÃ´ng viá»‡c.");
    }
  };

  const handleTaskChanged = () => fetchTasks();
  const handleNext = () => page < totalPages && setPage((p) => p + 1);
  const handlePrev = () => page > 1 && setPage((p) => p - 1);
  const handlePageChange = (newPage) => setPage(newPage);

  const filteredTasks = taskBuffer.filter((task) => {
    switch (filter) {
      case "active":
        return task.status === "active";
      case "completed":
        return task.status === "complete";
      default:
        return true;
    }
  });

  const visibleTasks = filteredTasks.slice((page - 1) * visibleTaskLimit, page * visibleTaskLimit);
  if (visibleTasks.length === 0 && page > 1) handlePrev();
  const totalPages = Math.ceil(filteredTasks.length / visibleTaskLimit);

  return (
    <div className="min-h-screen w-full bg-[#fefcff] relative">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 30% 70%, rgba(173, 216, 230, 0.35), transparent 60%)," +
            "radial-gradient(circle at 70% 30%, rgba(255, 182, 193, 0.4), transparent 60%)",
        }}
      />
      <div className="container relative z-10 pt-6 md:pt-8 mx-auto">
        <div className="w-full max-w-2xl p-4 md:p-6 mx-auto space-y-5 md:space-y-6">
          <div className="space-y-1 text-center">
            <h1 className="text-3xl font-semibold">{projectName || "Dá»± Ã¡n"}</h1>
            <p className="text-muted-foreground text-sm">CÃ´ng viá»‡c cho dá»± Ã¡n nÃ y</p>
          </div>

          <AddTask handleNewTaskAdded={handleTaskChanged} projectId={projectId} compact />

          <StatsAndFilters
            filter={filter}
            setFilter={setFilter}
            activeTasksCount={activeTaskCount}
            completedTasksCount={completeTaskCount}
            pomodoroCount={pomodoroTotal}
          />

          <TaskList
            filteredTasks={visibleTasks}
            filter={filter}
            handleTaskChanged={handleTaskChanged}
            pomodoroCounts={pomodoroCounts}
            compact
          />

          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <TaskListPagination
              handleNext={handleNext}
              handlePrev={handlePrev}
              handlePageChange={handlePageChange}
              page={page}
              totalPages={totalPages}
            />
            <DateTimeFilter dateQuery={dateQuery} setDateQuery={setDateQuery} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectTodos;
