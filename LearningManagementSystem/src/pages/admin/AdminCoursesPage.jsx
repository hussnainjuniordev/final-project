import { useEffect, useState } from "react";
import {
  Badge,
  Button,
  Col,
  Container,
  Modal,
  Row,
  Spinner,
} from "react-bootstrap";
import { Inbox, Play, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import VideoPlayer from "../../components/VideoPlayer.jsx";
import * as courseService from "../../services/courseService.js";
import * as lessonService from "../../services/lessonService.js";

/* ── Video Preview Modal ───────────────────────────────── */
function VideoModal({ lesson, onClose }) {
  if (!lesson) return null;
  return (
    <Modal show onHide={onClose} centered size="lg">
      <Modal.Header
        closeButton
        style={{
          background: "var(--surface-2)",
          borderBottom: "1px solid var(--border-1)",
        }}
      >
        <Modal.Title
          style={{
            color: "var(--text-1)",
            fontSize: "0.95rem",
            fontWeight: 600,
          }}
        >
          <Play size={16} style={{ marginRight: "0.5rem" }} /> {lesson.title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ background: "#000", padding: 0 }}>
        <VideoPlayer url={lesson.videoUrl} title={lesson.title} />
      </Modal.Body>
    </Modal>
  );
}

/* ── Lesson Card ───────────────────────────────────────── */
function LessonCard({ lesson, onDelete, onPreview }) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm("Delete this lesson? This cannot be undone.")) return;
    setDeleting(true);
    try {
      await lessonService.deleteLesson(lesson._id);
      toast.success("Lesson deleted successfully!");
      onDelete(lesson._id);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete lesson.");
      setDeleting(false);
    }
  };

  return (
    <div
      style={{
        background: "var(--surface-2)",
        border: "1px solid var(--border-1)",
        borderRadius: "var(--radius-sm)",
        padding: "0.85rem 1rem",
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
      }}
    >
      {/* Number circle */}
      <div
        style={{
          width: 34,
          height: 34,
          borderRadius: "50%",
          flexShrink: 0,
          background: "var(--brand-dim)",
          border: "1px solid var(--brand-border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "0.7rem",
          color: "var(--brand)",
        }}
      >
        <Play size={14} />
      </div>

      {/* Title + date */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            color: "var(--text-1)",
            fontSize: "0.875rem",
            fontWeight: 500,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {lesson.title}
        </div>
        <div
          style={{
            color: "var(--text-3)",
            fontSize: "0.72rem",
            marginTop: "0.1rem",
          }}
        >
          Added{" "}
          {new Date(lesson.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </div>
      </div>

      {/* ▶ Watch button */}
      <button
        onClick={() => onPreview(lesson)}
        style={{
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          gap: "0.35rem",
          background: "var(--brand-dim)",
          border: "1px solid var(--brand-border)",
          borderRadius: "var(--radius-xs)",
          padding: "0.3rem 0.7rem",
          color: "var(--brand)",
          fontSize: "0.78rem",
          fontWeight: 600,
          cursor: "pointer",
          transition: "background 0.15s",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.background = "rgba(124,111,247,0.22)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.background = "var(--brand-dim)")
        }
      >
        <Play size={16} style={{ marginRight: "0.5rem" }} /> Watch
      </button>

      {/* Delete */}
      <button
        onClick={handleDelete}
        disabled={deleting}
        title="Delete lesson"
        style={{
          flexShrink: 0,
          background: "none",
          border: "1px solid rgba(255,107,138,0.3)",
          borderRadius: "6px",
          color: "var(--red, #ff6b8a)",
          cursor: "pointer",
          padding: "0.25rem 0.5rem",
          fontSize: "0.75rem",
          lineHeight: 1,
          transition: "background 0.15s",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.background = "rgba(255,107,138,0.1)")
        }
        onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
      >
        {deleting ? "..." : <Trash2 size={16} />}
      </button>
    </div>
  );
}

/* ── Course Card ───────────────────────────────────────── */
function CourseCard({ course, onDeleteCourse }) {
  const [lessons, setLessons] = useState([]);
  const [loadingLessons, setLoadingLessons] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [previewLesson, setPreviewLesson] = useState(null);

  const loadLessons = async () => {
    if (expanded) {
      setExpanded(false);
      return;
    }
    if (lessons.length > 0) {
      setExpanded(true);
      return;
    }
    setLoadingLessons(true);
    setExpanded(true);
    try {
      const res = await lessonService.getLessons(course._id);
      setLessons(res.data);
    } catch {
      setLessons([]);
    } finally {
      setLoadingLessons(false);
    }
  };

  const handleDeleteLesson = (lessonId) => {
    setLessons((prev) => prev.filter((l) => l._id !== lessonId));
  };

  const handleDeleteCourse = async () => {
    if (!window.confirm("Delete this course and all its lessons?")) return;
    setDeleting(true);
    try {
      await courseService.deleteCourse(course._id);
      toast.success("Course deleted successfully!");
      onDeleteCourse(course._id);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete course.");
      setDeleting(false);
    }
  };

  return (
    <>
      <div
        style={{
          background: "var(--surface-1)",
          border: "1px solid var(--border-1)",
          borderRadius: "var(--radius)",
          overflow: "hidden",
          transition: "border-color 0.2s",
        }}
      >
        {/* Course header */}
        <div style={{ padding: "1.25rem 1.5rem" }}>
          <div className="d-flex justify-content-between align-items-start gap-3">
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
                <Badge bg="secondary">{course.category}</Badge>
                <span
                  style={{
                    color: "var(--brand)",
                    fontWeight: 700,
                    fontSize: "0.85rem",
                  }}
                >
                  {course.price === 0 ? "Free" : `$${course.price}`}
                </span>
              </div>
              <div
                style={{
                  color: "var(--text-1)",
                  fontWeight: 600,
                  fontSize: "1rem",
                  marginBottom: "0.25rem",
                }}
              >
                {course.title}
              </div>
              <div style={{ color: "var(--text-3)", fontSize: "0.8rem" }}>
                👨‍🏫 {course.instructor?.name || "—"}
              </div>
            </div>

            {/* Actions */}
            <div className="d-flex gap-2 flex-shrink-0">
              <button
                onClick={loadLessons}
                style={{
                  background: expanded
                    ? "var(--brand-dim)"
                    : "var(--surface-2)",
                  border: `1px solid ${expanded ? "var(--brand-border)" : "var(--border-2)"}`,
                  color: expanded ? "var(--brand)" : "var(--text-2)",
                  borderRadius: "var(--radius-xs)",
                  padding: "0.35rem 0.75rem",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.15s",
                  whiteSpace: "nowrap",
                }}
              >
                {expanded ? "▲ Hide Lessons" : "▼ View Lessons"}
              </button>
              <button
                onClick={handleDeleteCourse}
                disabled={deleting}
                style={{
                  background: "none",
                  border: "1px solid rgba(255,107,138,0.3)",
                  borderRadius: "var(--radius-xs)",
                  color: "var(--red, #ff6b8a)",
                  cursor: "pointer",
                  padding: "0.35rem 0.65rem",
                  fontSize: "0.8rem",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "rgba(255,107,138,0.1)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "none")
                }
              >
                {deleting ? (
                  "..."
                ) : (
                  <>
                    <Trash2 size={16} style={{ marginRight: "0.5rem" }} />{" "}
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Lessons panel */}
        {expanded && (
          <div
            style={{
              borderTop: "1px solid var(--border-1)",
              padding: "1rem 1.5rem",
              background: "rgba(0,0,0,0.2)",
            }}
          >
            <div
              style={{
                color: "var(--text-3)",
                fontSize: "0.7rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: "0.75rem",
              }}
            >
              Lessons {!loadingLessons && `(${lessons.length})`}
            </div>

            {loadingLessons ? (
              <div className="text-center py-3">
                <Spinner animation="border" size="sm" />
              </div>
            ) : lessons.length === 0 ? (
              <p
                style={{
                  color: "var(--text-3)",
                  fontSize: "0.85rem",
                  margin: 0,
                }}
              >
                No lessons uploaded yet.
              </p>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                {lessons.map((lesson) => (
                  <LessonCard
                    key={lesson._id}
                    lesson={lesson}
                    onDelete={handleDeleteLesson}
                    onPreview={setPreviewLesson}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Video modal */}
      {previewLesson && (
        <VideoModal
          lesson={previewLesson}
          onClose={() => setPreviewLesson(null)}
        />
      )}
    </>
  );
}

/* ── Main Page ─────────────────────────────────────────── */
function AdminCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const res = await courseService.getCourses();
        if (!cancelled) setCourses(res.data);
      } catch (err) {
        if (!cancelled)
          toast.error("Failed to load courses. Please try again.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleDeleteCourse = (id) =>
    setCourses((prev) => prev.filter((c) => c._id !== id));

  const filtered = courses.filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.category.toLowerCase().includes(search.toLowerCase()) ||
      (c.instructor?.name || "").toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <Container className="page-section py-5">
      {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
        <div className="section-heading">
          <span className="eyebrow mb-1">Admin Panel</span>
          <h1 className="h2 fw-bold mb-0" style={{ color: "var(--text-1)" }}>
            Manage Courses
          </h1>
        </div>
        <div style={{ color: "var(--text-3)", fontSize: "0.85rem" }}>
          {courses.length} course{courses.length !== 1 ? "s" : ""} total
        </div>
      </div>

      {/* Search */}
      {!loading && courses.length > 0 && (
        <div className="mb-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search by title, category or instructor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ maxWidth: "400px" }}
          />
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" />
          <p className="mt-3" style={{ color: "var(--text-2)" }}>
            Loading courses...
          </p>
        </div>
      ) : filtered.length === 0 ? (
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
            <Inbox size={32} />
          </div>
          <p style={{ color: "var(--text-2)", margin: 0 }}>
            {search ? "No courses match your search." : "No courses found."}
          </p>
        </div>
      ) : (
        <Row className="g-3">
          {filtered.map((course) => (
            <Col key={course._id} xs={12}>
              <CourseCard course={course} onDeleteCourse={handleDeleteCourse} />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}

export default AdminCoursesPage;
