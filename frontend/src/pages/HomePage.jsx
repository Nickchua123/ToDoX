import React, { useEffect, useState } from "react";
import AddTask from "@/components/AddTask";
import DateTimeFilter from "@/components/DateTimeFilter";
import Footer from "@/components/Footer";
import { Header } from "@/components/Header";
import StatsAndFilters from "@/components/StatsAndFilters";
import TaskList from "@/components/TaskList";
import TaskListPagination from "@/components/TaskListPagination";
import { toast } from "sonner";
import api from "@/lib/axios";
import { visibleTaskLimit } from "@/lib/data";

const HomePage = () => {
  const [taskBuffer, setTaskBuffer] = useState([]);
  const [activeTaskCount, setActiveTaskCount] = useState(0);
  const [completeTaskCount, setCompleteTaskCount] = useState(0);
  const [filter, setFilter] = useState("all");
  const [dateQuery, setDateQuery] = useState("today");
  const [page, setPage] = useState(1);
  const [pomodoroCounts, setPomodoroCounts] = useState({});
  const [pomodoroTotal, setPomodoroTotal] = useState(0);

  useEffect(() => {
    fetchTasks();
  }, [dateQuery]);

  useEffect(() => {
    const handler = () => fetchTasks();
    window.addEventListener("tasks:refresh", handler);
    return () => window.removeEventListener("tasks:refresh", handler);
  }, [dateQuery]);

  useEffect(() => {
    setPage(1);
  }, [filter, dateQuery]);

  const fetchTasks = async () => {
    try {
      const res = await api.get(`/tasks?filter=${dateQuery}`);
      setTaskBuffer(res.data.tasks);
      setActiveTaskCount(res.data.activeCount);
      setCompleteTaskCount(res.data.completeCount);
      const ids = (res.data.tasks || []).map((t) => t._id).join(",");
      if (ids) {
        const [countsRes, statsRes] = await Promise.all([
          api.get(`/pomodoro/task-counts?taskIds=${ids}&range=${dateQuery}`),
          api.get(`/pomodoro/stats?range=${dateQuery}`),
        ]);
        setPomodoroCounts(countsRes.data || {});
        setPomodoroTotal(statsRes.data?.focusCount || 0);
      } else {
        setPomodoroCounts({});
        setPomodoroTotal(0);
      }
    } catch (error) {
      console.error("Lỗi khi tải tasks:", error);
      toast.error("Không thể tải danh sách công việc.");
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

  const visibleTasks = filteredTasks.slice(
    (page - 1) * visibleTaskLimit,
    page * visibleTaskLimit
  );
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
      <div className="container relative z-10 pt-4 md:pt-6 mx-auto">
        <div className="w-full max-w-2xl p-4 md:p-5 mx-auto space-y-4 md:space-y-5">
          <Header />

          <AddTask handleNewTaskAdded={handleTaskChanged} compact />

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

          <Footer
            activeTasksCount={activeTaskCount}
            completedTasksCount={completeTaskCount}
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
