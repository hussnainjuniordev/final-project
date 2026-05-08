import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  GraduationCap, LogOut, User, BookOpen, BarChart3,
  Users, Home, BookMarked, Upload, PlusCircle, Menu, X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

const navItems = {
  student: [
    { to: "/", icon: Home, label: "Home", end: true },
    { to: "/courses", icon: BookOpen, label: "Courses" },
    { to: "/dashboard/my-courses", icon: BookMarked, label: "My Courses" },
    { to: "/dashboard/profile", icon: User, label: "Profile" },
  ],
  instructor: [
    { to: "/", icon: Home, label: "Home", end: true },
    { to: "/dashboard/instructor/courses", icon: BookOpen, label: "My Courses" },
    { to: "/dashboard/instructor/courses/new", icon: PlusCircle, label: "Create" },
    { to: "/dashboard/instructor/lessons/upload", icon: Upload, label: "Upload" },
    { to: "/dashboard/profile", icon: User, label: "Profile" },
  ],
  admin: [
    { to: "/dashboard/admin/users", icon: Users, label: "Users" },
    { to: "/dashboard/admin/courses", icon: BookOpen, label: "Courses" },
    { to: "/dashboard/admin/analytics", icon: BarChart3, label: "Analytics" },
    { to: "/dashboard/profile", icon: User, label: "Profile" },
  ],
};

const roleGrad = {
  student:    "linear-gradient(135deg,#06b6d4,#10b981)",
  instructor: "linear-gradient(135deg,#3b82f6,#6366f1)",
  admin:      "linear-gradient(135deg,#f59e0b,#ef4444)",
};
const roleLabel = { student: "Student", instructor: "Instructor", admin: "Admin" };

function DashboardLayout() {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const items = navItems[role] || [];
  const grad  = roleGrad[role] || "linear-gradient(135deg,#6366f1,#8b5cf6)";

  const handleLogout = () => { logout(); navigate("/"); };
  const close = () => setOpen(false);

  return (
    <div className="ds-shell">

      {/* ════════ TOPBAR ════════ */}
      <header className="ds-topbar">
        {/* Left: hamburger + brand */}
        <div className="ds-topbar-left">
          <button className="ds-hamburger" onClick={() => setOpen(o => !o)} aria-label="Menu">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
          <Link to="/" className="ds-brand">
            <span className="brand-icon" style={{ width: 30, height: 30, borderRadius: 8 }}>
              <GraduationCap size={16} color="#fff" />
            </span>
            <span className="brand-text">LMS Portal</span>
          </Link>
        </div>

        {/* Right: user + logout */}
        <div className="ds-topbar-right">
          <div className="ds-user-chip">
            <div className="ds-avatar" style={{ background: grad }}>
              <User size={13} color="#fff" />
            </div>
            <div className="ds-user-text">
              <span className="ds-user-name">{user?.name?.split(" ")[0] || "User"}</span>
              <span className="ds-user-role">{roleLabel[role]}</span>
            </div>
          </div>
          <button className="ds-logout-btn" onClick={handleLogout}>
            <LogOut size={15} />
            <span className="ds-logout-label">Logout</span>
          </button>
        </div>
      </header>

      {/* ════════ OVERLAY ════════ */}
      {open && <div className="ds-overlay" onClick={close} />}

      {/* ════════ BODY ════════ */}
      <div className="ds-body">

        {/* ════════ SIDEBAR ════════ */}
        <aside className={`ds-sidebar ${open ? "ds-sidebar--open" : ""}`}>

          {/* Profile block */}
          <div className="ds-profile-block">
            <div className="ds-profile-avatar" style={{ background: grad }}>
              <User size={22} color="#fff" />
            </div>
            <div className="ds-profile-info">
              <p className="ds-profile-name">{user?.name || "User"}</p>
              <p className="ds-profile-email">{user?.email}</p>
            </div>
          </div>

          {/* Role pill */}
          <div className="ds-role-pill" style={{ background: grad }}>
            {roleLabel[role]} Dashboard
          </div>

          {/* Divider */}
          <div className="ds-divider" />

          {/* Nav */}
          <nav className="ds-nav">
            <p className="ds-nav-label">Navigation</p>
            {items.map(({ to, icon: Icon, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={close}
                className={({ isActive }) =>
                  `ds-nav-link ${isActive ? "ds-nav-link--active" : ""}`
                }
              >
                <span className="ds-nav-icon"><Icon size={16} /></span>
                <span className="ds-nav-label-text">{label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Spacer */}
          <div style={{ flex: 1 }} />

          {/* Logout */}
          <div className="ds-divider" />
          <button className="ds-sidebar-logout" onClick={handleLogout}>
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </aside>

        {/* ════════ MAIN ════════ */}
        <main className="ds-main">
          <Outlet />
        </main>
      </div>

      {/* ════════ MOBILE BOTTOM NAV ════════ */}
      <nav className="ds-bottom-nav">
        {items.slice(0, 5).map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `ds-bottom-nav-item ${isActive ? "ds-bottom-nav-item--active" : ""}`
            }
          >
            <Icon size={20} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

export default DashboardLayout;
