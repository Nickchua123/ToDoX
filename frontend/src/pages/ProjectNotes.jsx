import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import api from "@/lib/axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function ProjectNotes() {
  const { projectId } = useParams();
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/projects/${projectId}`);
      setName(res.data?.name || "");
      setDescription(res.data?.description || "");
      setNotes(res.data?.notes || "");
    } catch (e) {
      toast.error("Không tải được ghi chú dự án");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [projectId]);

  const save = async () => {
    try {
      setSaving(true);
      await api.put(`/projects/${projectId}/meta`, { description, notes });
      toast.success("Đã lưu ghi chú");
    } catch (e) {
      toast.error("Không thể lưu ghi chú");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6 text-center">Đang tải ghi chú…</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Ghi chú dự án</h1>
        <Link to="/projects"><Button variant="outline">Quay lại</Button></Link>
      </div>

      <Card className="border-0 bg-gradient-card shadow-custom-lg p-4">
        <div className="mb-3">
          <div className="text-sm text-muted-foreground">Tên dự án</div>
          <div className="font-medium">{name}</div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Mô tả</label>
          <textarea
            className="w-full min-h-24 rounded-md border border-border/50 bg-white/50 p-3 outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Mục tiêu, phạm vi, thông tin chung…"
          />
        </div>

        <div className="space-y-2 mt-4">
          <label className="text-sm font-medium">Ghi chú/Nhật ký</label>
          <textarea
            className="w-full min-h-64 rounded-md border border-border/50 bg-white/50 p-3 outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Ghi chú, quyết định, link tài liệu…"
          />
        </div>

        <div className="mt-4 flex gap-2">
          <Button variant="gradient" onClick={save} disabled={saving}>{saving ? "Đang lưu…" : "Lưu"}</Button>
          <Button variant="outline" onClick={load} disabled={saving}>Hoàn tác</Button>
        </div>
      </Card>
    </div>
  );
}

