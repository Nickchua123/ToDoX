import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import api from "@/lib/axios";
import { toast } from "sonner";

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newName, setNewName] = useState("");

  const fetchProjects = async () => {
    try {
      const res = await api.get("/projects");
      setProjects(res.data);
    } catch (err) {
      toast.error("Không tải được danh sách dự án");
    }
  };

  useEffect(() => { fetchProjects(); }, []);

  const addProject = async () => {
    const name = newName.trim();
    if (!name) return;
    setLoading(true);
    try {
      await api.post("/projects", { name });
      setNewName("");
      await fetchProjects();
      toast.success("Đã thêm dự án");
    } catch (err) {
      toast.error(err.response?.data?.message || "Thêm dự án thất bại");
    } finally {
      setLoading(false);
    }
  };

  const renameProject = async (id, prev) => {
    const name = prompt("Đổi tên dự án:", prev);
    if (name == null) return;
    const finalName = String(name).trim();
    if (!finalName) return;
    try {
      await api.put(`/projects/${id}`, { name: finalName });
      await fetchProjects();
      toast.success("Đã đổi tên");
    } catch (err) {
      toast.error(err.response?.data?.message || "Đổi tên thất bại");
    }
  };

  const deleteProject = async (id) => {
    if (!confirm("Xóa dự án này?")) return;
    try {
      await api.delete(`/projects/${id}`);
      await fetchProjects();
      toast.success("Đã xóa dự án");
    } catch (err) {
      toast.error(err.response?.data?.message || "Xóa dự án thất bại");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Dự án</h1>

      <div className="flex gap-2 mb-6">
        <input
          className="flex-1 border rounded-lg p-3"
          placeholder="Tên dự án mới"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <button
          onClick={addProject}
          disabled={loading}
          className="px-4 py-2 rounded-lg bg-primary text-white"
        >
          + Thêm
        </button>
      </div>

      <ul className="space-y-2">
        {projects.map((p) => (
          <li key={p._id} className="flex items-center justify-between border rounded-lg p-3">
            <div>
              <div className="font-medium">{p.name}</div>
              <div className="text-xs text-muted-foreground">{new Date(p.createdAt).toLocaleString()}</div>
            </div>
            <div className="flex gap-2">
              <Link className="px-3 py-2 rounded-lg border hover:bg-black/5" to={`/projects/${p._id}/notes`}>Ghi chú</Link>
              <button className="px-3 py-2 rounded-lg border" onClick={() => renameProject(p._id, p.name)}>Đổi tên</button>
              <button className="px-3 py-2 rounded-lg border text-red-600" onClick={() => deleteProject(p._id)}>Xóa</button>
            </div>
          </li>
        ))}
        {projects.length === 0 && <li className="text-sm text-muted-foreground">Chưa có dự án nào.</li>}
      </ul>
    </div>
  );
};

export default ProjectsPage;

