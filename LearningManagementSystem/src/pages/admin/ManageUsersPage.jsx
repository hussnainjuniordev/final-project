import { useEffect, useState } from "react";
import { Button, Col, Container, Modal, Row, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { BookOpen, GraduationCap } from "lucide-react";
import * as courseService from "../../services/courseService.js";
import * as userService from "../../services/userService.js";

/* ── small helpers ─────────────────────────────────────── */
const fmt = (d) =>
  new Date(d).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const RolePill = ({ role }) => {
  const styles = {
    instructor: {
      bg: "rgba(96,165,250,0.12)",
      color: "#60a5fa",
      border: "rgba(96,165,250,0.25)",
    },
    student: {
      bg: "rgba(52,211,153,0.12)",
      color: "#34d399",
      border: "rgba(52,211,153,0.25)",
    },
  };
  const s = styles[role] || {
    bg: "rgba(148,163,184,0.1)",
    color: "#94a3b8",
    border: "rgba(148,163,184,0.2)",
  };
  return (
    <span
      style={{
        background: s.bg,
        color: s.color,
        border: `1px solid ${s.border}`,
        padding: "0.18rem 0.65rem",
        borderRadius: "999px",
        fontSize: "0.72rem",
        fontWeight: 600,
        textTransform: "capitalize",
      }}
    >
      {role}
    </span>
  );
};

/* ── User Detail Modal ─────────────────────────────────── */
function UserDetailModal({ user, onClose, onDelete }) {
  if (!user) return null;
  return (
    <Modal show onHide={onClose} centered>
      <Modal.Header
        closeButton
        style={{
          background: "var(--surface-2)",
          border: "1px solid var(--border-1)",
          borderBottom: "1px solid var(--border-1)",
        }}
      >
        <Modal.Title
          style={{ color: "var(--text-1)", fontSize: "1rem", fontWeight: 600 }}
        >
          User Details
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ background: "var(--surface-1)", padding: "1.5rem" }}>
        {/* Avatar */}
        <div className="text-center mb-4">
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              background:
                user.role === "instructor"
                  ? "rgba(96,165,250,0.15)"
                  : "rgba(52,211,153,0.15)",
              border: `2px solid ${user.role === "instructor" ? "rgba(96,165,250,0.3)" : "rgba(52,211,153,0.3)"}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.8rem",
              margin: "0 auto 0.75rem",
            }}
          >
            {user.role === "instructor" ? (
              <BookOpen size={20} style={{ color: "#fff" }} />
            ) : (
              <GraduationCap size={20} style={{ color: "#fff" }} />
            )}
          </div>
          <div
            style={{
              color: "var(--text-1)",
              fontWeight: 700,
              fontSize: "1.1rem",
            }}
          >
            {user.name}
          </div>
          <RolePill role={user.role} />
        </div>

        {/* Details */}
        {[
          { label: "Email", value: user.email },
          {
            label: "Role",
            value: user.role.charAt(0).toUpperCase() + user.role.slice(1),
          },
          ...(user.role === "instructor"
            ? [
                {
                  label: "Courses Created",
                  value:
                    user.courseCount === null
                      ? "Loading..."
                      : `${user.courseCount ?? 0}`,
                },
              ]
            : []),
          { label: "Joined", value: fmt(user.createdAt) },
          { label: "User ID", value: user._id },
        ].map(({ label, value }) => (
          <div
            key={label}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "0.65rem 0",
              borderBottom: "1px solid var(--border-1)",
            }}
          >
            <span
              style={{
                color: "var(--text-3)",
                fontSize: "0.82rem",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              {label}
            </span>
            <span
              style={{
                color: "var(--text-1)",
                fontSize: "0.875rem",
                fontFamily: label === "User ID" ? "monospace" : "inherit",
                maxWidth: "60%",
                textAlign: "right",
                wordBreak: "break-all",
              }}
            >
              {value}
            </span>
          </div>
        ))}
      </Modal.Body>
      <Modal.Footer
        style={{
          background: "var(--surface-2)",
          border: "1px solid var(--border-1)",
          borderTop: "1px solid var(--border-1)",
          gap: "0.5rem",
        }}
      >
        <Button variant="outline-light" size="sm" onClick={onClose}>
          Close
        </Button>
        <Button
          variant="outline-danger"
          size="sm"
          onClick={() => {
            onDelete(user._id);
            onClose();
          }}
        >
          Delete User
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

/* ── User Card ─────────────────────────────────────────── */
function UserCard({ user, onView, onDelete }) {
  const [courseCount, setCourseCount] = useState(null);

  // Fetch course count only for instructors
  useEffect(() => {
    if (user.role !== "instructor") return;
    let cancelled = false;
    courseService
      .getCourses()
      .then((res) => {
        if (!cancelled) {
          const count = res.data.filter(
            (c) => c.instructor?._id === user._id,
          ).length;
          setCourseCount(count);
        }
      })
      .catch(() => {
        if (!cancelled) setCourseCount(0);
      });
    return () => {
      cancelled = true;
    };
  }, [user._id, user.role]);

  return (
    <div
      style={{
        background: "var(--surface-1)",
        border: "1px solid var(--border-1)",
        borderRadius: "var(--radius)",
        padding: "1.25rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
        transition: "border-color 0.2s, transform 0.2s",
        cursor: "default",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "rgba(20,184,166,0.3)";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--border-1)";
        e.currentTarget.style.transform = "none";
      }}
    >
      {/* Top row */}
      <div className="d-flex align-items-center gap-3">
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            flexShrink: 0,
            background:
              user.role === "instructor"
                ? "rgba(96,165,250,0.12)"
                : "rgba(52,211,153,0.12)",
            border: `1.5px solid ${user.role === "instructor" ? "rgba(96,165,250,0.25)" : "rgba(52,211,153,0.25)"}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.2rem",
          }}
        >
          {user.role === "instructor" ? (
            <BookOpen size={20} style={{ color: "#fff" }} />
          ) : (
            <GraduationCap size={20} style={{ color: "#fff" }} />
          )}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              color: "var(--text-1)",
              fontWeight: 600,
              fontSize: "0.9rem",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {user.name}
          </div>
          <div
            style={{
              color: "var(--text-3)",
              fontSize: "0.78rem",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {user.email}
          </div>
        </div>
        <RolePill role={user.role} />
      </div>

      {/* Instructor course count */}
      {user.role === "instructor" && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            background: "var(--surface-2)",
            border: "1px solid var(--border-1)",
            borderRadius: "var(--radius-sm)",
            padding: "0.5rem 0.75rem",
          }}
        >
          <span style={{ fontSize: "0.9rem" }}>
            <BookOpen size={16} style={{ marginRight: "0.3rem" }} />
          </span>
          <span style={{ color: "var(--text-2)", fontSize: "0.82rem" }}>
            {courseCount === null
              ? "Loading courses..."
              : `${courseCount} course${courseCount !== 1 ? "s" : ""} created`}
          </span>
        </div>
      )}

      {/* Joined */}
      <div style={{ color: "var(--text-3)", fontSize: "0.78rem" }}>
        Joined {fmt(user.createdAt)}
      </div>

      {/* Actions */}
      <div className="d-flex gap-2">
        <Button
          variant="outline-light"
          size="sm"
          className="flex-grow-1"
          onClick={() => onView({ ...user, courseCount })}
        >
          View Details
        </Button>
        <Button
          variant="outline-danger"
          size="sm"
          onClick={() => onDelete(user._id)}
        >
          Delete
        </Button>
      </div>
    </div>
  );
}

/* ── Main Page ─────────────────────────────────────────── */
function ManageUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("students");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const res = await userService.getUsers();
        if (!cancelled) setUsers(res.data.filter((u) => u.role !== "admin"));
      } catch (err) {
        if (!cancelled) toast.error("Failed to load users. Please try again.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await userService.deleteUser(id);
      setUsers((prev) => prev.filter((u) => u._id !== id));
      toast.success("User deleted successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete user.");
    }
  };

  const students = users.filter((u) => u.role === "student");
  const instructors = users.filter((u) => u.role === "instructor");
  const displayed = activeTab === "students" ? students : instructors;

  const tabStyle = (tab) => ({
    padding: "0.5rem 1.25rem",
    borderRadius: "var(--radius-xs)",
    fontWeight: 600,
    fontSize: "0.875rem",
    cursor: "pointer",
    border: "none",
    transition: "all 0.15s",
    background: activeTab === tab ? "var(--brand)" : "var(--surface-2)",
    color: activeTab === tab ? "#0d1117" : "var(--text-2)",
  });

  return (
    <Container className="page-section py-5">
      {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
        <div className="section-heading">
          <span className="eyebrow mb-1">Admin Panel</span>
          <h1 className="h2 fw-bold mb-0" style={{ color: "var(--text-1)" }}>
            Manage Users
          </h1>
        </div>
        <div style={{ color: "var(--text-3)", fontSize: "0.85rem" }}>
          {students.length} student{students.length !== 1 ? "s" : ""} ·{" "}
          {instructors.length} instructor{instructors.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Tabs */}
      <div className="d-flex gap-2 mb-4">
        <button
          style={tabStyle("students")}
          onClick={() => setActiveTab("students")}
        >
          <GraduationCap size={16} style={{ marginRight: "0.5rem" }} /> Students
          ({students.length})
        </button>
        <button
          style={tabStyle("instructors")}
          onClick={() => setActiveTab("instructors")}
        >
          <BookOpen size={16} style={{ marginRight: "0.5rem" }} /> Instructors (
          {instructors.length})
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" />
          <p className="mt-3" style={{ color: "var(--text-2)" }}>
            Loading users...
          </p>
        </div>
      ) : displayed.length === 0 ? (
        <div
          style={{
            background: "var(--surface-1)",
            border: "1px solid var(--border-1)",
            borderRadius: "var(--radius)",
            padding: "3rem",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>
            {activeTab === "students" ? (
              <GraduationCap size={28} style={{ color: "var(--brand)" }} />
            ) : (
              <BookOpen size={28} style={{ color: "var(--brand)" }} />
            )}
          </div>
          <p style={{ color: "var(--text-2)", margin: 0 }}>
            No {activeTab} found.
          </p>
        </div>
      ) : (
        <Row className="g-3">
          {displayed.map((u) => (
            <Col key={u._id} sm={6} lg={4}>
              <UserCard user={u} onView={setSelected} onDelete={handleDelete} />
            </Col>
          ))}
        </Row>
      )}

      {/* Detail Modal */}
      {selected && (
        <UserDetailModal
          user={selected}
          onClose={() => setSelected(null)}
          onDelete={handleDelete}
        />
      )}
    </Container>
  );
}

export default ManageUsersPage;
