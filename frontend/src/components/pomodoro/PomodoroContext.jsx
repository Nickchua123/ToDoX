import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import api from "@/lib/axios";

const PomodoroContext = createContext(null);

const DEFAULT_CONFIG = {
  focus: 25 * 60 * 1000,
  short: 5 * 60 * 1000,
  long: 15 * 60 * 1000,
  interval: 4,
  autoSwitch: true,
  sound: true,
  notifications: true,
};

const STORAGE_KEY = "todx:pomodoro:v1";

export function PomodoroProvider({ children }) {
  const [phase, setPhase] = useState("idle");
  const [isRunning, setIsRunning] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState(null);
  const [currentTaskTitle, setCurrentTaskTitle] = useState("");
  const [round, setRound] = useState(0);
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [remainingMs, setRemainingMs] = useState(DEFAULT_CONFIG.focus);
  const endAtRef = useRef(null);
  const startedAtRef = useRef(null);
  const timerRef = useRef(null);
  const [completionPrompt, setCompletionPrompt] = useState(null);

  const durationForPhase = useCallback((p) => {
    const c = config;
    if (p === "focus") return c.focus;
    if (p === "short") return c.short;
    if (p === "long") return c.long;
    return c.focus;
  }, [config]);

  const persist = useCallback(() => {
    try {
      const data = { phase, isRunning, currentTaskId, currentTaskTitle, round, config, remainingMs, endAt: endAtRef.current };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {}
  }, [phase, isRunning, currentTaskId, currentTaskTitle, round, config, remainingMs]);

  const stopTimer = () => { if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; } };

  const logSessionSafe = useCallback(async (p, startedAt, endedAt, durationMs) => {
    try {
      await api.post("/pomodoro/sessions", { taskId: currentTaskId, phase: p, startedAt, endedAt, durationMs, aborted: false });
    } catch {}
  }, [currentTaskId]);

  const startTicking = useCallback(() => {
    stopTimer();
    timerRef.current = setInterval(() => {
      if (!endAtRef.current) return;
      const left = Math.max(0, endAtRef.current - Date.now());
      setRemainingMs(left);
      if (left <= 0) {
        stopTimer();
        if (phase === "focus") {
          if (startedAtRef.current) {
            const endedAt = Date.now();
            const planned = durationForPhase("focus");
            logSessionSafe("focus", new Date(startedAtRef.current).toISOString(), new Date(endedAt).toISOString(), planned);
          }
          if (currentTaskId) setCompletionPrompt({ taskId: currentTaskId, title: currentTaskTitle });
          const nextRound = round + 1;
          setRound(nextRound);
          const nextPhase = (nextRound % config.interval === 0) ? "long" : "short";
          setPhase(nextPhase);
          setIsRunning(config.autoSwitch);
          const now = Date.now();
          startedAtRef.current = config.autoSwitch ? now : null;
          endAtRef.current = config.autoSwitch ? now + durationForPhase(nextPhase) : null;
          setRemainingMs(durationForPhase(nextPhase));
          if (config.autoSwitch) startTicking();
        } else {
          const nextPhase = "focus";
          setPhase(nextPhase);
          setIsRunning(config.autoSwitch);
          const now = Date.now();
          startedAtRef.current = config.autoSwitch ? now : null;
          endAtRef.current = config.autoSwitch ? now + durationForPhase(nextPhase) : null;
          setRemainingMs(durationForPhase(nextPhase));
          if (config.autoSwitch) startTicking();
        }
      }
    }, 250);
  }, [phase, round, config, durationForPhase, logSessionSafe, currentTaskId, currentTaskTitle]);

  const start = useCallback((taskId, taskTitle = "") => {
    setCurrentTaskId(taskId || null);
    setCurrentTaskTitle(taskTitle || "");
    setPhase("focus");
    setIsRunning(true);
    const dur = durationForPhase("focus");
    setRemainingMs(dur);
    const now = Date.now();
    startedAtRef.current = now;
    endAtRef.current = now + dur;
    startTicking();
  }, [durationForPhase, startTicking]);

  const pause = useCallback(() => { setIsRunning(false); stopTimer(); endAtRef.current = null; }, []);
  const resume = useCallback(() => {
    if (phase === "idle" || isRunning) return;
    setIsRunning(true);
    const now = Date.now();
    startedAtRef.current = now;
    endAtRef.current = now + remainingMs;
    startTicking();
  }, [phase, isRunning, remainingMs, startTicking]);

  const reset = useCallback(() => {
    stopTimer();
    setPhase("idle"); setIsRunning(false); setRound(0); setCurrentTaskId(null); setCurrentTaskTitle("");
    setRemainingMs(durationForPhase("focus"));
    endAtRef.current = null; startedAtRef.current = null;
  }, [durationForPhase]);

  const skip = useCallback(() => {
    stopTimer();
    if (phase === "focus") {
      const nextRound = round + 1; setRound(nextRound);
      const next = (nextRound % config.interval === 0) ? "long" : "short";
      setPhase(next); setIsRunning(true); const dur = durationForPhase(next); setRemainingMs(dur); endAtRef.current = Date.now() + dur; startTicking();
    } else {
      setPhase("focus"); setIsRunning(true); const dur = durationForPhase("focus"); setRemainingMs(dur); endAtRef.current = Date.now() + dur; startTicking();
    }
  }, [phase, round, config.interval, durationForPhase, startTicking]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const data = JSON.parse(raw);
      if (data && typeof data === "object") {
        setPhase(data.phase || "idle");
        setIsRunning(Boolean(data.isRunning));
        setCurrentTaskId(data.currentTaskId || null);
        setCurrentTaskTitle(data.currentTaskTitle || "");
        setRound(Number(data.round) || 0);
        setConfig({ ...DEFAULT_CONFIG, ...(data.config || {}) });
        const now = Date.now();
        if (data.endAt && data.isRunning) {
          const left = Math.max(0, data.endAt - now);
          setRemainingMs(left || durationForPhase(data.phase || "focus"));
          if (left > 0) { endAtRef.current = now + left; startTicking(); }
        } else {
          setRemainingMs(Number(data.remainingMs) || durationForPhase(data.phase || "focus"));
        }
      }
    } catch {}
  }, []);

  useEffect(() => { persist(); }, [persist]);

  const value = useMemo(() => ({
    phase, isRunning, currentTaskId, currentTaskTitle, round, config, remainingMs,
    start, pause, resume, reset, skip, setConfig,
    completionPrompt, setCompletionPrompt,
  }), [phase, isRunning, currentTaskId, currentTaskTitle, round, config, remainingMs, start, pause, resume, reset, skip, completionPrompt]);

  return <PomodoroContext.Provider value={value}>{children}</PomodoroContext.Provider>;
}

export function usePomodoro() {
  const ctx = useContext(PomodoroContext);
  if (!ctx) throw new Error("usePomodoro must be used within PomodoroProvider");
  return ctx;
}

