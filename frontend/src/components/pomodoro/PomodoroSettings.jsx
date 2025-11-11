import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { usePomodoro } from "./PomodoroContext";

function msToMin(ms) { return Math.round(ms / 60000); }
function minToMs(min) { const n = Number(min); return Number.isFinite(n) && n > 0 ? n * 60000 : 0; }

export default function PomodoroSettings({ trigger }) {
  const { config, setConfig } = usePomodoro();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(() => ({
    focus: msToMin(config.focus),
    short: msToMin(config.short),
    long: msToMin(config.long),
    interval: config.interval,
    autoSwitch: config.autoSwitch,
    sound: config.sound,
    notifications: config.notifications,
  }));

  const onChange = (k, v) => setForm((s) => ({ ...s, [k]: v }));

  const onSave = () => {
    setConfig({
      focus: minToMs(form.focus) || config.focus,
      short: minToMs(form.short) || config.short,
      long: minToMs(form.long) || config.long,
      interval: Math.max(1, parseInt(form.interval || 4, 10)),
      autoSwitch: !!form.autoSwitch,
      sound: !!form.sound,
      notifications: !!form.notifications,
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cài đặt Pomodoro</DialogTitle>
          <DialogDescription>Thời lượng, tự chuyển pha, âm thanh/notification.</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-3">
          <label className="text-sm">Tập trung (phút)</label>
          <Input type="number" min={1} value={form.focus} onChange={(e) => onChange("focus", e.target.value)} />
          <label className="text-sm">Nghỉ ngắn (phút)</label>
          <Input type="number" min={1} value={form.short} onChange={(e) => onChange("short", e.target.value)} />
          <label className="text-sm">Nghỉ dài (phút)</label>
          <Input type="number" min={1} value={form.long} onChange={(e) => onChange("long", e.target.value)} />
          <label className="text-sm">Số phiên trước nghỉ dài</label>
          <Input type="number" min={1} value={form.interval} onChange={(e) => onChange("interval", e.target.value)} />
          <label className="text-sm col-span-2"><input className="mr-2" type="checkbox" checked={form.autoSwitch} onChange={(e)=>onChange("autoSwitch", e.target.checked)} />Tự động chuyển pha</label>
          <label className="text-sm col-span-2"><input className="mr-2" type="checkbox" checked={form.sound} onChange={(e)=>onChange("sound", e.target.checked)} />Âm thanh chime</label>
          <label className="text-sm col-span-2"><input className="mr-2" type="checkbox" checked={form.notifications} onChange={(e)=>onChange("notifications", e.target.checked)} />Thông báo desktop</label>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Hủy</Button>
          <Button variant="gradient" onClick={onSave}>Lưu</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

