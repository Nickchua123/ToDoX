import React, { useCallback, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { cn } from "@/lib/utils";
import api from "@/lib/axios";
import {
  Home,
  Search,
  Library,
  UserRound,
  LayoutGrid,
  Sun,
  Moon,
  ChevronLeft,
  LogOut,
  Plus,
  Pencil,
  Trash2,
} from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { toast } from "sonner";

export default function Sidebar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem("sidebar:collapsed") === "true";
    } catch {
      return false;
    }
  });

  // Theme (local to sidebar)
  const [sidebarTheme, setSidebarTheme] = useState(() => {
    try {
      return localStorage.getItem("sidebar:theme") || "dark";
    } catch {
      return "dark";
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem("sidebar:theme", sidebarTheme);
    } catch {}
  }, [sidebarTheme]);

  const toggleTheme = useCallback(
    () => setSidebarTheme((t) => (t === "dark" ? "light" : "dark")),
    []
  );
  const toggleCollapsed = useCallback(() => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("sidebar:collapsed", String(next));
      } catch {}
      return next;
    });
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      await api.post("/auth/logout");
    } catch {}
    navigate("/login");
  }, [navigate]);

  const nav = [{ label: "Trang chủ", to: "/", icon: Home }];

  // Projects
  const [projects, setProjects] = useState([]);
  const PROJECTS_PREVIEW_COUNT = 4;
  const [allProjectsOpen, setAllProjectsOpen] = useState(false);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const fetchProjects = useCallback(async () => {
    setLoadingProjects(true);
    try {
      const res = await api.get("/projects");
      setProjects(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      try { const { toast } = await import("sonner"); toast.error(err?.response?.data?.message || "Không tải được danh sách dự án"); } catch {}
      setProjects([]);
    } finally {
      setLoadingProjects(false);
    }
  }, []);
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Add project dialog
  const [addOpen, setAddOpen] = useState(false);
  const [addName, setAddName] = useState("");
  const [addNotes, setAddNotes] = useState("");
  const [adding, setAdding] = useState(false);
  const openAdd = useCallback(() => {
    setAddName("");
    setAddNotes("");
    setAddOpen(true);
  }, []);
  const addProject = useCallback(async () => {
    const name = addName.trim();
    if (!name) return;
    setAdding(true);
    try {
      const res = await api.post("/projects", { name });
      const created = res.data;
      if (addNotes.trim()) {
        try {
          await api.put(`/projects/${created._id}/meta`, {
            description: created.description || "",
            notes: addNotes,
          });
        } catch {}
      }
      setProjects((prev) => [created, ...prev]);
      setAddOpen(false);
      toast.success("Đã thêm dự án");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Thêm dự án thất bại");
    }
    finally {
      setAdding(false);
    }
  }, [addName, addNotes]);

  // Edit project dialog
  const [editOpen, setEditOpen] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const [editName, setEditName] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);
  const [members, setMembers] = useState([]);
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [newMemberRole, setNewMemberRole] = useState("viewer");
  const openEdit = useCallback(async (p) => {
    setEditProject(p);
    setEditName(p?.name || "");
    try {
      const res = await api.get(`/projects/${p._id}`);
      setEditNotes(res.data?.notes || "");
    } catch {
      setEditNotes("");
    }
    try {
      const resM = await api.get(`/projects/${p._id}/members`);
      setMembers(Array.isArray(resM.data) ? resM.data : []);
    } catch {
      setMembers([]);
    }
    setEditOpen(true);
  }, []);
  const saveEdit = useCallback(async () => {
    if (!editProject) return;
    setSavingEdit(true);
    try {
      let updated = editProject;
      if (editName && editName !== editProject.name) {
        const res = await api.put(`/projects/${editProject._id}`, {
          name: editName.trim(),
        });
        updated = res.data;
      }
      await api.put(`/projects/${editProject._id}/meta`, {
        description: updated.description || "",
        notes: editNotes || "",
      });
      setProjects((prev) =>
        prev.map((it) => (it._id === updated._id ? { ...updated, notes: editNotes } : it))
      );
      setEditOpen(false);
      toast.success("Đã lưu dự án");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Lưu dự án thất bại");
    }
    finally {
      setSavingEdit(false);
    }
  }, [editProject, editName, editNotes]);

  // Delete project dialog
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const openDelete = useCallback((p) => {
    setDeleteTarget(p);
    setDeleteOpen(true);
  }, []);
  const deleteProject = useCallback(async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.delete(`/projects/${deleteTarget._id}`);
      setProjects((prev) => prev.filter((it) => it._id !== deleteTarget._id));
      setDeleteOpen(false);
      toast.success("Đã xóa dự án");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Xóa dự án thất bại");
    }
    finally {
      setDeleting(false);
    }
  }, [deleteTarget]);

  // Logout confirm dialog
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const confirmLogout = useCallback(async () => {
    setLoggingOut(true);
    try {
      await handleLogout();
    } finally {
      setLoggingOut(false);
      setLogoutOpen(false);
    }
  }, [handleLogout]);

  return (
    <aside
      className={cn(
        "hidden md:flex shrink-0 h-screen sticky top-0 border-r relative",
        collapsed ? "md:w-16" : "md:w-64 lg:w-72 xl:w-80",
        sidebarTheme === "dark"
          ? "border-white/5 bg-[#0b1220] text-white/90"
          : "border-black/10 bg-white text-slate-800"
      )}
    >
      <div className="flex flex-col h-full w-full overflow-y-auto overflow-x-hidden">
        {/* Brand + controls */}
        <div
          className={cn(
            "px-3 py-3",
            collapsed ? "flex flex-col items-center gap-2" : "flex items-center justify-between"
          )}
        >
          <button
            onClick={() => {
              if (collapsed) toggleCollapsed();
            }}
            title={collapsed ? "Mở thanh bên" : "ToDoX"}
            aria-label={collapsed ? "Mở thanh bên" : "ToDoX"}
            className={cn(
              "h-9 w-9 rounded-full grid place-items-center",
              collapsed
                ? sidebarTheme === "dark"
                  ? "hover:bg-white/10 cursor-pointer"
                  : "hover:bg-black/5 cursor-pointer"
                : sidebarTheme === "dark"
                ? "bg-white/10 cursor-default"
                : "bg-black/5 cursor-default"
            )}
          >
            <LayoutGrid size={18} />
          </button>
          {!collapsed && <div className="font-semibold">ToDoX</div>}
          <div className={cn("gap-2", collapsed ? "flex flex-col items-center" : "flex items-center")}>
            <button
              onClick={toggleTheme}
              title={sidebarTheme === "dark" ? "Chuyển sáng" : "Chuyển tối"}
              className={cn(
                "h-9 w-9 rounded-full grid place-items-center",
                sidebarTheme === "dark" ? "hover:bg-white/10" : "hover:bg-black/5"
              )}
            >
              {sidebarTheme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            {!collapsed && (
              <button
                onClick={toggleCollapsed}
                title="Thu gọn"
                className={cn(
                  "h-9 w-9 rounded-full grid place-items-center",
                  sidebarTheme === "dark" ? "hover:bg-white/10" : "hover:bg-black/5"
                )}
              >
                <ChevronLeft size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-2 space-y-5">
          <div>
            <ul className={cn("space-y-2", collapsed && "flex flex-col items-center gap-3 space-y-0")}>
              {nav.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.to;
                const content = (
                  <div
                    className={cn(
                      "group relative flex items-center rounded-2xl text-sm",
                      collapsed ? "justify-center p-1.5" : "gap-3 px-3 py-2",
                      sidebarTheme === "dark"
                        ? isActive
                          ? "bg-white/10"
                          : "hover:bg-white/5"
                        : isActive
                        ? "bg-black/5"
                        : "hover:bg-black/5",
                      item.disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                    )}
                  >
                    <span className={cn(collapsed ? "h-9 w-9 rounded-full grid place-items-center" : "grid place-items-center")}>
                      <Icon size={18} className={cn("shrink-0", sidebarTheme === "dark" ? "text-white/80" : "text-slate-700")} />
                    </span>
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </div>
                );
                return (
                  <li key={item.label}>{item.disabled ? <div>{content}</div> : <Link to={item.to}>{content}</Link>}</li>
                );
              })}
            </ul>
          </div>

          {/* Search (display only) */}
          <div>
            <div
              className={cn(
                "flex items-center gap-3 rounded-2xl text-sm",
                collapsed ? "justify-center p-1.5" : "px-3 py-2",
                sidebarTheme === "dark" ? "hover:bg-white/5" : "hover:bg-black/5"
              )}
            >
              <span className={cn(collapsed ? "h-9 w-9 rounded-full grid place-items-center" : "grid place-items-center")} title="Tìm kiếm">
                <Search size={18} className={cn("shrink-0", sidebarTheme === "dark" ? "text-white/80" : "text-slate-700")} />
              </span>
              {!collapsed && (
                <input
                  type="text"
                  placeholder="Tìm kiếm"
                  className={cn(
                    "w-full bg-transparent outline-none text-sm",
                    sidebarTheme === "dark" ? "placeholder-white/60" : "placeholder-slate-500"
                  )}
                  readOnly
                />
              )}
            </div>
          </div>

          {/* Projects */}
          <div>
            <div className={cn("flex items-center justify-between", collapsed ? "px-0" : "px-2")}>
              {!collapsed && (
                <div className={cn("mb-2 text-[11px] uppercase tracking-wider", sidebarTheme === "dark" ? "text-white/50" : "text-slate-500")}>Dự án</div>
              )}
              {!collapsed && (
                <button onClick={openAdd} title="Thêm dự án" className={cn("h-6 w-6 rounded grid place-items-center", sidebarTheme === "dark" ? "hover:bg-white/10" : "hover:bg-black/5")}>
                  <Plus size={14} />
                </button>
              )}
            </div>
            <ul className={cn("space-y-2", collapsed && "flex flex-col items-center gap-3 space-y-0")}>
              {loadingProjects && !projects.length && (
                <li className={cn("text-xs", sidebarTheme === "dark" ? "text-white/60" : "text-slate-500")}>{!collapsed ? "Đang tải..." : "..."}</li>
              )}
              {projects.slice(0, PROJECTS_PREVIEW_COUNT).map((p) => {
                const isActive = pathname === `/projects/${p._id}`;
                return (
                  <li key={p._id} className="group">
                    <div
                      className={cn(
                        "relative flex items-center rounded-2xl text-sm",
                        collapsed ? "justify-center p-1.5" : "gap-3 px-3 py-2",
                        sidebarTheme === "dark" ? (isActive ? "bg-white/10" : "hover:bg-white/5") : (isActive ? "bg-black/5" : "hover:bg-black/5"),
                        "cursor-pointer"
                      )}
                      onClick={() => navigate(`/projects/${p._id}`)}
                      title={p.name}
                    >
                      <span className={cn(collapsed ? "h-9 w-9 rounded-full grid place-items-center" : "grid place-items-center")}>
                        <Library size={18} className={cn("shrink-0", sidebarTheme === "dark" ? "text-white/80" : "text-slate-700")} />
                      </span>
                      {!collapsed && <span className="truncate flex-1">{p.name}</span>}
                      {!collapsed && (
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                          <button onClick={(e) => { e.stopPropagation(); openEdit(p); }} title="Đổi tên" className={cn("h-6 w-6 rounded grid place-items-center", sidebarTheme === "dark" ? "hover:bg-white/10" : "hover:bg-black/5")}>
                            <Pencil size={14} />
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); openDelete(p); }} title="Xóa" className={cn("h-6 w-6 rounded grid place-items-center", sidebarTheme === "dark" ? "hover:bg-white/10" : "hover:bg-black/5")}>
                            <Trash2 size={14} />
                          </button>
                        </span>
                      )}
                    </div>
                  </li>
                );
              })}
              {!collapsed && projects.length > PROJECTS_PREVIEW_COUNT && (
                <li>
                  <button
                    onClick={() => setAllProjectsOpen(true)}
                    className={cn(
                      "w-full text-center rounded-2xl text-xs px-3 py-2",
                      sidebarTheme === "dark" ? "hover:bg-white/5 text-white/80" : "hover:bg-black/5 text-slate-700"
                    )}
                  >
                    {`Xem tất cả (${projects.length - PROJECTS_PREVIEW_COUNT})`}
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Account */}
          <div>
            {!collapsed && (
              <div className={cn("px-2 mb-2 text-[11px] uppercase tracking-wider", sidebarTheme === "dark" ? "text-white/50" : "text-slate-500")}>Tài khoản</div>
            )}
            <ul className={cn("space-y-2", collapsed && "flex flex-col items-center gap-3 space-y-0")}>
              <li>
                <Link to="/profile" title="Hồ sơ">
                  <div
                    className={cn(
                      "group relative flex items-center rounded-2xl text-sm",
                      collapsed ? "justify-center p-1.5" : "gap-3 px-3 py-2",
                      sidebarTheme === "dark" ? (pathname === "/profile" ? "bg-white/10" : "hover:bg-white/5") : (pathname === "/profile" ? "bg-black/5" : "hover:bg-black/5")
                    )}
                  >
                    <span className={cn(collapsed ? "h-9 w-9 rounded-full grid place-items-center" : "grid place-items-center")}>
                      <UserRound size={18} className={cn("shrink-0", sidebarTheme === "dark" ? "text-white/80" : "text-slate-700")} />
                    </span>
                    {!collapsed && <span className="truncate">Hồ sơ</span>}
                  </div>
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        {/* Sign out */}
        <div className={cn("px-3 pb-4 pt-2 mt-auto", collapsed && "flex justify-center")}> 
          <button
            onClick={() => setLogoutOpen(true)}
            className={cn(
              "flex items-center gap-3 rounded-2xl text-sm",
              collapsed ? "h-10 w-10 justify-center" : "w-full px-3 py-2",
              sidebarTheme === "dark" ? "hover:bg-white/5" : "hover:bg-black/5"
            )}
          >
            <LogOut size={18} className={cn(sidebarTheme === "dark" ? "text-white/80" : "text-slate-700")} />
            {!collapsed && <span>Đăng xuất</span>}
          </button>
        </div>
      </div>

      {/* Edit project dialog */}
      <Dialog.Root open={editOpen} onOpenChange={setEditOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40 z-[100]" />
          <Dialog.Content
            className={cn(
              "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-sm rounded-xl p-4 shadow-xl z-[110] focus:outline-none",
              sidebarTheme === "dark" ? "bg-[#0b1220] text-white" : "bg-white text-slate-800 border"
            )}
          >
            <Dialog.Title className="text-base font-semibold mb-2">Sửa dự án</Dialog.Title>
            <div className="space-y-3">
              <div>
                <label className={cn("text-xs mb-1 block", sidebarTheme === "dark" ? "text-white/70" : "text-slate-600")}>Tên</label>
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className={cn(
                    "w-full rounded-md px-3 py-2 text-sm outline-none",
                    sidebarTheme === "dark" ? "bg-white/10 text-white placeholder-white/60" : "bg-slate-50 text-slate-800 border"
                  )}
                  placeholder="Tên dự án"
                />
              </div>
              <div>
                <label className={cn("text-xs mb-1 block", sidebarTheme === "dark" ? "text-white/70" : "text-slate-600")}>Ghi chú</label>
                <textarea
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  rows={4}
                  className={cn(
                    "w-full rounded-md px-3 py-2 text-sm outline-none resize-y",
                    sidebarTheme === "dark" ? "bg-white/10 text-white placeholder-white/60" : "bg-slate-50 text-slate-800 border"
                  )}
                  placeholder="Ghi chú cho dự án..."
                />
              </div>

              {/* Sharing */}
              <div className="pt-1">
                <div className="text-xs mb-1 font-medium">Chia sẻ dự án</div>
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="email"
                    value={newMemberEmail}
                    onChange={(e) => setNewMemberEmail(e.target.value)}
                    placeholder="Email người dùng"
                    className={cn(
                      "flex-1 rounded-md px-3 py-2 text-sm outline-none",
                      sidebarTheme === "dark" ? "bg-white/10 text-white placeholder-white/60" : "bg-slate-50 text-slate-800 border"
                    )}
                  />
                  <select
                    value={newMemberRole}
                    onChange={(e) => setNewMemberRole(e.target.value)}
                    className={cn(
                      "rounded-md px-2 py-2 text-sm",
                      sidebarTheme === "dark" ? "bg-white/10 text-white" : "bg-slate-50 text-slate-800 border"
                    )}
                  >
                    <option value="viewer">Xem</option>
                    <option value="editor">Sửa</option>
                  </select>
                  <button
                    onClick={async () => {
                      if (!editProject || !newMemberEmail.trim()) return;
                      try {
                        const res = await api.post(`/projects/${editProject._id}/members`, { email: newMemberEmail.trim(), role: newMemberRole });
                        setMembers((prev) => [...prev, res.data]);
                        setNewMemberEmail("");
                        toast.success(`Đã chia sẻ cho ${res?.data?.user?.email || newMemberEmail.trim()}`);
                      } catch (err) {
                        toast.error(err?.response?.data?.message || "Chia sẻ thất bại");
                      }
                    }}
                    className={cn("h-9 px-3 rounded-md text-sm", sidebarTheme === "dark" ? "bg-white/20 hover:bg-white/25" : "bg-slate-800 text-white hover:bg-slate-700")}
                  >
                    Thêm
                  </button>
                </div>

                <ul className="space-y-2">
                  {members.map((m) => (
                    <li key={m.user?._id || m.user} className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className={cn("h-6 w-6 rounded-full grid place-items-center text-xs", sidebarTheme === "dark" ? "bg-white/10" : "bg-black/5")}>
                          👥
                        </div>
                        <div className="truncate text-sm">{m.user?.email || m.email}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <select
                          value={m.role}
                          onChange={async (e) => {
                            try {
                              await api.put(`/projects/${editProject._id}/members/${m.user?._id || m.user}`, { role: e.target.value });
                              setMembers((prev) => prev.map((x) => (String(x.user?._id || x.user) === String(m.user?._id || m.user) ? { ...x, role: e.target.value } : x)));
                              toast.success("Đã cập nhật quyền");
                            } catch (err) {
                              toast.error(err?.response?.data?.message || "Cập nhật quyền thất bại");
                            }
                          }}
                          className={cn("rounded-md px-2 py-1 text-xs", sidebarTheme === "dark" ? "bg-white/10 text-white" : "bg-slate-50 text-slate-800 border")}
                        >
                          <option value="viewer">Xem</option>
                          <option value="editor">Sửa</option>
                        </select>
                        <button
                          onClick={async () => {
                            try {
                              await api.delete(`/projects/${editProject._id}/members/${m.user?._id || m.user}`);
                              setMembers((prev) => prev.filter((x) => String(x.user?._id || x.user) !== String(m.user?._id || m.user)));
                              toast.success("Đã gỡ thành viên");
                            } catch (err) {
                              toast.error(err?.response?.data?.message || "Gỡ thành viên thất bại");
                            }
                          }}
                          className={cn("h-7 w-7 rounded grid place-items-center", sidebarTheme === "dark" ? "hover:bg-white/10" : "hover:bg-black/5")}
                          title="Gỡ"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </li>
                  ))}
                  {members.length === 0 && (
                    <li className={cn("text-xs", sidebarTheme === "dark" ? "text-white/60" : "text-slate-500")}>Chưa chia sẻ cho ai.</li>
                  )}
                </ul>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 mt-4">
              <button onClick={() => setEditOpen(false)} className={cn("h-9 px-3 rounded-md text-sm", sidebarTheme === "dark" ? "bg-white/10 hover:bg-white/15" : "bg-black/5 hover:bg-black/10")}>Hủy</button>
              <button
                onClick={saveEdit}
                disabled={savingEdit || !editName.trim()}
                className={cn(
                  "h-9 px-3 rounded-md text-sm",
                  sidebarTheme === "dark" ? "bg-white/20 hover:bg-white/25" : "bg-slate-800 text-white hover:bg-slate-700",
                  savingEdit && "opacity-50 cursor-not-allowed"
                )}
              >
                Lưu
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Add project dialog */}
      <Dialog.Root open={addOpen} onOpenChange={setAddOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40 z-[100]" />
          <Dialog.Content
            className={cn(
              "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-sm rounded-xl p-4 shadow-xl z-[110] focus:outline-none",
              sidebarTheme === "dark" ? "bg-[#0b1220] text-white" : "bg-white text-slate-800 border"
            )}
          >
            <Dialog.Title className="text-base font-semibold mb-2">Thêm dự án</Dialog.Title>
            <div className="space-y-3">
              <div>
                <label className={cn("text-xs mb-1 block", sidebarTheme === "dark" ? "text-white/70" : "text-slate-600")}>Tên</label>
                <input
                  value={addName}
                  onChange={(e) => setAddName(e.target.value)}
                  className={cn(
                    "w-full rounded-md px-3 py-2 text-sm outline-none",
                    sidebarTheme === "dark" ? "bg-white/10 text-white placeholder-white/60" : "bg-slate-50 text-slate-800 border"
                  )}
                  placeholder="Tên dự án"
                />
              </div>
              <div>
                <label className={cn("text-xs mb-1 block", sidebarTheme === "dark" ? "text-white/70" : "text-slate-600")}>Ghi chú</label>
                <textarea
                  value={addNotes}
                  onChange={(e) => setAddNotes(e.target.value)}
                  rows={3}
                  className={cn(
                    "w-full rounded-md px-3 py-2 text-sm outline-none resize-y",
                    sidebarTheme === "dark" ? "bg-white/10 text-white placeholder-white/60" : "bg-slate-50 text-slate-800 border"
                  )}
                  placeholder="Ghi chú cho dự án (tuỳ chọn)"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 mt-4">
              <button onClick={() => setAddOpen(false)} className={cn("h-9 px-3 rounded-md text-sm", sidebarTheme === "dark" ? "bg-white/10 hover:bg-white/15" : "bg-black/5 hover:bg-black/10")}>Hủy</button>
              <button
                onClick={addProject}
                disabled={adding || !addName.trim()}
                className={cn(
                  "h-9 px-3 rounded-md text-sm",
                  sidebarTheme === "dark" ? "bg-white/20 hover:bg-white/25" : "bg-slate-800 text-white hover:bg-slate-700",
                  (adding || !addName.trim()) && "opacity-50 cursor-not-allowed"
                )}
              >
                Thêm
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Delete project dialog */}
      <Dialog.Root open={deleteOpen} onOpenChange={setDeleteOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40 z-[100]" />
          <Dialog.Content
            className={cn(
              "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-sm rounded-xl p-4 shadow-xl z-[110] focus:outline-none",
              sidebarTheme === "dark" ? "bg-[#0b1220] text-white" : "bg-white text-slate-800 border"
            )}
          >
            <Dialog.Title className="text-base font-semibold mb-2">Xóa dự án</Dialog.Title>
            <p className={cn("text-sm", sidebarTheme === "dark" ? "text-white/80" : "text-slate-600")}>Bạn có chắc muốn xóa dự án <span className="font-semibold">{deleteTarget?.name}</span>?</p>
            <div className="flex items-center justify-end gap-2 mt-4">
              <button onClick={() => setDeleteOpen(false)} className={cn("h-9 px-3 rounded-md text-sm", sidebarTheme === "dark" ? "bg-white/10 hover:bg-white/15" : "bg-black/5 hover:bg-black/10")}>Hủy</button>
              <button
                onClick={deleteProject}
                disabled={deleting}
                className={cn(
                  "h-9 px-3 rounded-md text-sm",
                  sidebarTheme === "dark" ? "bg-white/20 hover:bg-white/25" : "bg-red-600 text-white hover:bg-red-700",
                  deleting && "opacity-50 cursor-not-allowed"
                )}
              >
                Xóa
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Logout confirm dialog */}
      <Dialog.Root open={logoutOpen} onOpenChange={setLogoutOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40 z-[100]" />
          <Dialog.Content
            className={cn(
              "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-sm rounded-xl p-4 shadow-xl z-[110] focus:outline-none",
              sidebarTheme === "dark" ? "bg-[#0b1220] text-white" : "bg-white text-slate-800 border"
            )}
          >
            <Dialog.Title className="text-base font-semibold mb-2">Đăng xuất</Dialog.Title>
            <p className={cn("text-sm", sidebarTheme === "dark" ? "text-white/80" : "text-slate-600")}>Bạn có chắc muốn đăng xuất?</p>
            <div className="flex items-center justify-end gap-2 mt-4">
              <button onClick={() => setLogoutOpen(false)} className={cn("h-9 px-3 rounded-md text-sm", sidebarTheme === "dark" ? "bg-white/10 hover:bg-white/15" : "bg-black/5 hover:bg-black/10")}>Hủy</button>
              <button
                onClick={confirmLogout}
                disabled={loggingOut}
                className={cn(
                  "h-9 px-3 rounded-md text-sm",
                  sidebarTheme === "dark" ? "bg-white/20 hover:bg-white/25" : "bg-red-600 text-white hover:bg-red-700",
                  loggingOut && "opacity-50 cursor-not-allowed"
                )}
              >
                Đăng xuất
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* All projects dialog */}
      <Dialog.Root open={allProjectsOpen} onOpenChange={setAllProjectsOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40 z-[100]" />
          <Dialog.Content
            className={cn(
              "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[92vw] max-w-md rounded-xl p-4 shadow-xl z-[110] focus:outline-none",
              sidebarTheme === "dark" ? "bg-[#0b1220] text-white" : "bg-white text-slate-800 border"
            )}
          >
            <Dialog.Title className="text-base font-semibold mb-3">Tất cả dự án</Dialog.Title>
            <div className={cn("max-h-[60vh] overflow-y-auto pr-1")}> 
              <ul className="space-y-2">
                {projects.map((p) => (
                  <li key={p._id}>
                    <div className={cn("flex items-center gap-3 rounded-2xl px-3 py-2 text-sm", sidebarTheme === "dark" ? "hover:bg-white/5" : "hover:bg-black/5")}> 
                      <Library size={18} className={cn("shrink-0", sidebarTheme === "dark" ? "text-white/80" : "text-slate-700")} />
                      <button className="flex-1 text-left truncate" onClick={() => { setAllProjectsOpen(false); navigate(`/projects/${p._id}`); }} title={p.name}>
                        {p.name}
                      </button>
                      <button onClick={() => { setAllProjectsOpen(false); openEdit(p); }} title="Đổi tên" className={cn("h-7 w-7 rounded grid place-items-center", sidebarTheme === "dark" ? "hover:bg-white/10" : "hover:bg-black/5")}> 
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => { setAllProjectsOpen(false); openDelete(p); }} title="Xóa" className={cn("h-7 w-7 rounded grid place-items-center", sidebarTheme === "dark" ? "hover:bg-white/10" : "hover:bg-black/5")}> 
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex justify-end mt-4">
              <button onClick={() => setAllProjectsOpen(false)} className={cn("h-9 px-3 rounded-md text-sm", sidebarTheme === "dark" ? "bg-white/10 hover:bg-white/15" : "bg-black/5 hover:bg-black/10")}>Đóng</button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </aside>
  );
}
