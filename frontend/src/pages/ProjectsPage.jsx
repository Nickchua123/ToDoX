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
      toast.error("KhÃ´ng táº£i Ä‘Æ°á»£c danh sÃ¡ch dá»± Ã¡n");
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
      toast.success("ÄÃ£ thÃªm dá»± Ã¡n");
    } catch (err) {
      toast.error(err.response?.data?.message || "ThÃªm dá»± Ã¡n tháº¥t báº¡i");
    } finally {
      setLoading(false);
    }
  };

  const renameProject = async (id, prev) => {
    const name = prompt("Äá»•i tÃªn dá»± Ã¡n:", prev);
    if (name == null) return;
    const finalName = String(name).trim();
    if (!finalName) return;
    try {
      await api.put(`/projects/${id}`, { name: finalName });
      await fetchProjects();
      toast.success("ÄÃ£ Ä‘á»•i tÃªn");
    } catch (err) {
      toast.error(err.response?.data?.message || "Äá»•i tÃªn tháº¥t báº¡i");
    }
  };

  const deleteProject = async (id) => {
    if (!confirm("XÃ³a dá»± Ã¡n nÃ y?")) return;
    try {
      await api.delete(`/projects/${id}`);
      await fetchProjects();
      toast.success("ÄÃ£ xÃ³a dá»± Ã¡n");
    } catch (err) {
      toast.error(err.response?.data?.message || "XÃ³a dá»± Ã¡n tháº¥t báº¡i");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Dá»± Ã¡n</h1>

      <div className="flex gap-2 mb-6">
        <input
          className="flex-1 border rounded-lg p-3"
          placeholder="TÃªn dá»± Ã¡n má»›i"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <button
          onClick={addProject}
          disabled={loading}
          className="px-4 py-2 rounded-lg bg-primary text-white"
        >
          + ThÃªm
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
              <Link className="px-3 py-2 rounded-lg border hover:bg-black/5" to={`/projects/${p._id}/notes`}>Ghi chÃº</Link>
              <button className="px-3 py-2 rounded-lg border" onClick={() => renameProject(p._id, p.name)}>Äá»•i tÃªn</button>
              <button className="px-3 py-2 rounded-lg border text-red-600" onClick={() => deleteProject(p._id)}>XÃ³a</button>
            </div>
          </li>
        ))}
        {projects.length === 0 && <li className="text-sm text-muted-foreground">ChÆ°a cÃ³ dá»± Ã¡n nÃ o.</li>}
      </ul>
    </div>
  );
};

export default ProjectsPage;


