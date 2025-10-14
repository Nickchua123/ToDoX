import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { usePomodoro } from "./PomodoroContext";
import { Pause, Play, RotateCcw, SkipForward, Timer, Settings, Minimize2, CheckCircle2 } from "lucide-react";
import PomodoroSettings from "./PomodoroSettings";
import api from "@/lib/axios";
import { toast } from "sonner";
import { confettiBurst, playChime, MOTIVATION_QUOTES } from "@/lib/confetti";

const POS_KEY = "todx:pomodoro:pos";
const MIN_KEY = "todx:pomodoro:min";

export default function PomodoroBar() {
  const { phase, isRunning, remainingMs, currentTaskId, currentTaskTitle, start, pause, resume, reset, skip } = usePomodoro();

  const mm = String(Math.floor(remainingMs / 60000)).padStart(2, "0");
  const ss = String(Math.floor((remainingMs % 60000) / 1000)).padStart(2, "0");
  const phaseLabel = phase === "idle" ? "Pomodoro" : (phase === "focus" ? "Tập trung" : (phase === "short" ? "Nghỉ ngắn" : "Nghỉ dài"));

  const containerRef = React.useRef(null);
  const [pos, setPos] = React.useState(() => { try { const raw = localStorage.getItem(POS_KEY); return raw ? JSON.parse(raw) : null; } catch { return null; } });
  const [minimized, setMinimized] = React.useState(() => { try { return localStorage.getItem(MIN_KEY) === "1"; } catch { return false; } });
  const dragRef = React.useRef({ active: false, dx: 0, dy: 0 });
  const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
  const savePos = (p) => { try { localStorage.setItem(POS_KEY, JSON.stringify(p)); } catch {} };
  const saveMin = (v) => { try { localStorage.setItem(MIN_KEY, v ? "1" : "0"); } catch {} };

  React.useEffect(() => {
    const handler = (e) => {
      const tag = (e.target && e.target.tagName) ? e.target.tagName.toLowerCase() : "";
      const isEditable = tag === "input" || tag === "textarea" || (e.target && e.target.isContentEditable);
      if (isEditable) return;
      if (e.code === "Space") { e.preventDefault(); if (phase === "idle") start(null); else if (isRunning) pause(); else resume(); }
      else if (e.key === "n" || e.key === "N") { e.preventDefault(); if (phase !== "idle") skip(); }
      else if (e.key === "r" || e.key === "R") { e.preventDefault(); reset(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [phase, isRunning, start, pause, resume, reset, skip]);

  React.useEffect(() => {
    if (pos || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(8, window.innerWidth - rect.width - 16);
    const y = Math.max(8, window.innerHeight - rect.height - 16);
    const next = { x, y }; setPos(next); savePos(next);
  }, [pos]);

  React.useEffect(() => {
    const onResize = () => {
      if (!pos || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const maxX = Math.max(8, window.innerWidth - rect.width - 8);
      const maxY = Math.max(8, window.innerHeight - rect.height - 8);
      const next = { x: clamp(pos.x, 8, maxX), y: clamp(pos.y, 8, maxY) };
      if (next.x !== pos.x || next.y !== pos.y) { setPos(next); savePos(next); }
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [pos]);

  const floatingFallbackClass = !pos ? "left-1/2 -translate-x-1/2 bottom-4" : "";
  const onPointerDown = (e, toggleOnRelease = false) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    dragRef.current.active = true; dragRef.current.dx = e.clientX - rect.left; dragRef.current.dy = e.clientY - rect.top;
    const startX = e.clientX; const startY = e.clientY; let moved = false;
    const onMove = (ev) => {
      if (!dragRef.current.active) return;
      const width = rect.width; const height = rect.height;
      const maxX = Math.max(8, window.innerWidth - width - 8);
      const maxY = Math.max(8, window.innerHeight - height - 8);
      const x = clamp(ev.clientX - dragRef.current.dx, 8, maxX);
      const y = clamp(ev.clientY - dragRef.current.dy, 8, maxY);
      setPos({ x, y }); if (!moved && Math.hypot(ev.clientX - startX, ev.clientY - startY) > 6) moved = true;
    };
    const onUp = () => { dragRef.current.active = false; window.removeEventListener("pointermove", onMove); window.removeEventListener("pointerup", onUp); if (pos) savePos(pos); if (toggleOnRelease && !moved) { setMinimized(false); saveMin(false); } };
    window.addEventListener("pointermove", onMove); window.addEventListener("pointerup", onUp, { once: true });
  };

  if (phase === "idle") return null;

  const handleComplete = async () => {
    try {
      if (currentTaskId) {
        await api.put(`/tasks/${currentTaskId}`, { status: "complete", completedAt: new Date().toISOString() });
        toast.success("Hoàn thành nhiệm vụ! ✨");
      }
    } catch (e) {
      toast.error("Không thể hoàn thành nhiệm vụ");
    } finally {
      try {
        const rect = containerRef.current?.getBoundingClientRect?.();
        const originX = rect ? rect.left + rect.width / 2 : undefined;
        const originY = rect ? rect.top + rect.height / 2 : undefined;
        confettiBurst({ originX, originY }); playChime();
        const quote = MOTIVATION_QUOTES[(Math.random() * MOTIVATION_QUOTES.length) | 0]; toast.message(quote);
      } catch {}
      reset();
      try { window.dispatchEvent(new Event("tasks:refresh")); } catch {}
    }
  };

  return (
    <div ref={containerRef} className={`fixed z-50 ${minimized ? "w-auto" : "max-w-xl w-[92%] sm:w-[520px]"} ${floatingFallbackClass}`} style={pos ? { left: pos.x, top: pos.y } : undefined}>
      {minimized ? (
        <button onPointerDown={(e) => onPointerDown(e, true)} className="flex items-center gap-2 rounded-full bg-primary text-primary-foreground shadow-custom-lg px-3 py-2 select-none" title="Mở Pomodoro">
          <Timer className="size-4" />
          <span className="font-semibold tabular-nums">{mm}:{ss}</span>
        </button>
      ) : (
        <Card className="border-0 shadow-custom-lg bg-gradient-card">
          <div className="px-4 py-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0 cursor-move select-none" onPointerDown={(e) => onPointerDown(e, true)} title="Kéo để di chuyển">
              <div className="grid place-items-center size-10 rounded-full bg-primary/10 text-primary">
                <Timer className="size-5" />
              </div>
              <div className="min-w-0">
                <div className="text-sm text-muted-foreground truncate">{phaseLabel}{currentTaskTitle ? ` • ${currentTaskTitle}` : ""}</div>
                <div className="text-2xl font-semibold leading-none">{mm}:{ss}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isRunning ? (
                <Button size="icon" variant="outline" onClick={pause} title="Tạm dừng"><Pause className="size-4" /></Button>
              ) : (
                <Button size="icon" variant="outline" onClick={resume} title="Tiếp tục"><Play className="size-4" /></Button>
              )}
              <Button size="icon" variant="outline" onClick={skip} title="Chuyển pha"><SkipForward className="size-4" /></Button>
              <Button size="icon" variant="outline" onClick={reset} title="Đặt lại"><RotateCcw className="size-4" /></Button>
              <Button size="icon" variant="outline" title="Hoàn thành" onClick={handleComplete}><CheckCircle2 className="size-4" /></Button>
              <PomodoroSettings trigger={<Button size="icon" variant="outline" title="Cài đặt"><Settings className="size-4" /></Button>} />
              <Button size="icon" variant="outline" title="Thu gọn" onClick={() => { setMinimized(true); saveMin(true); }}><Minimize2 className="size-4" /></Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

