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
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { ArrowLeft, Inbox, Play, Trash2 } from "lucide-react";
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
function LessonCard({ lesson, index, onDelete, onPreview }) {
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
        background: "var(--surface-1)",
        border: "1px solid var(--border-1)",
        borderRadius: "var(--radius)",
        padding: "1.1rem 1.25rem",
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        transition: "border-color 0.2s, transform 0.2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--brand-border)";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--border-1)";
        e.currentTarget.style.transform = "none";
      }}
    >
      {/* Index circle */}
      <div
        style={{
          width: 42,
          height: 42,
          borderRadius: "50%",
          flexShrink: 0,
          background: "var(--brand-dim)",
          border: "1.5px solid var(--brand-border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 700,
          fontSize: "0.875rem",
          color: "var(--brand)",
        }}
      >
        {index + 1}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            color: "var(--text-1)",
            fontWeight: 600,
            fontSize: "0.95rem",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            marginBottom: "0.2rem",
          }}
        >
          {lesson.title}
        </div>
        <div style={{ color: "var(--text-3)", fontSize: "0.78rem" }}>
          📅 Uploaded{" "}
          {new Date(lesson.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </div>
      </div>

      {/* ▶ Watch Video button — clickable */}
      <button
        onClick={() => onPreview(lesson)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.4rem",
          background: "var(--brand-dim)",
          border: "1px solid var(--brand-border)",
          borderRadius: "var(--radius-xs)",
          padding: "0.35rem 0.75rem",
          color: "var(--brand)",
          fontSize: "0.78rem",
          fontWeight: 600,
          flexShrink: 0,
          cursor: "pointer",
          transition: "background 0.15s",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.background = "rgba(20,184,166,0.2)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.background = "var(--brand-dim)")
        }
      >
        <Play size={16} style={{ marginRight: "0.5rem" }} /> Watch
      </button>

      {/* Delete */}
      <Button
        variant="outline-danger"
        size="sm"
        disabled={deleting}
        onClick={handleDelete}
        style={{ flexShrink: 0 }}
      >
        {deleting ? (
          <Spinner animation="border" size="sm" />
        ) : (
          <>
            <Trash2 size={16} style={{ marginRight: "0.5rem" }} /> Delete
          </>
        )}
      </Button>
    </div>
  );
}

/* ── Main Page ─────────────────────────────────────────── */
function InstructorCourseLessonsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewLesson, setPreviewLesson] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const [courseRes, lessonsRes] = await Promise.all([
          courseService.getCourseById(id),
          lessonService.getLessons(id),
        ]);
        if (!cancelled) {
          setCourse(courseRes.data);
          setLessons(lessonsRes.data);
        }
      } catch {
        if (!cancelled) toast.error("Failed to load course data.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleDeleteLesson = (lessonId) => {
    setLessons((prev) => prev.filter((l) => l._id !== lessonId));
  };

  if (loading) {
    return (
      <Container className="page-section py-5 text-center">
        <Spinner animation="border" />
        <p className="mt-3" style={{ color: "var(--text-2)" }}>
          Loading...
        </p>
      </Container>
    );
  }

  return (
    <Container className="page-section py-5">
      {/* Back */}
      <button
        onClick={() => navigate("/dashboard/instructor/courses")}
        style={{
          background: "none",
          border: "none",
          color: "var(--text-2)",
          cursor: "pointer",
          fontSize: "0.875rem",
          fontWeight: 500,
          display: "flex",
          alignItems: "center",
          gap: "0.4rem",
          marginBottom: "1.5rem",
          padding: 0,
          transition: "color 0.15s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "var(--brand)")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-2)")}
      >
        <ArrowLeft size={16} /> Back to My Courses
      </button>

      {/* Course banner */}
      {course && (
        <div
          style={{
            background: "var(--surface-1)",
            border: "1px solid var(--border-1)",
            borderRadius: "var(--radius)",
            padding: "1.5rem 2rem",
            marginBottom: "2rem",
            borderLeft: "4px solid var(--brand)",
          }}
        >
          <div className="d-flex flex-wrap justify-content-between align-items-start gap-3">
            <div>
              <div className="d-flex align-items-center gap-2 mb-1">
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
              <h1
                style={{
                  color: "var(--text-1)",
                  fontWeight: 700,
                  fontSize: "1.4rem",
                  margin: "0 0 0.4rem",
                }}
              >
                {course.title}
              </h1>
              <p
                style={{
                  color: "var(--text-2)",
                  fontSize: "0.875rem",
                  margin: 0,
                  maxWidth: "600px",
                }}
              >
                {course.description}
              </p>
            </div>
            <div style={{ textAlign: "center", minWidth: "80px" }}>
              <div
                style={{
                  color: "var(--brand)",
                  fontWeight: 800,
                  fontSize: "2.2rem",
                  lineHeight: 1,
                }}
              >
                {lessons.length}
              </div>
              <div
                style={{
                  color: "var(--text-3)",
                  fontSize: "0.78rem",
                  marginTop: "0.2rem",
                }}
              >
                lesson{lessons.length !== 1 ? "s" : ""}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lessons header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-3">
        <div className="section-heading">
          <span className="eyebrow mb-1">Course Content</span>
          <h2 className="h4 fw-bold mb-0" style={{ color: "var(--text-1)" }}>
            Uploaded Lessons
          </h2>
        </div>
        <Button
          as={Link}
          to="/dashboard/instructor/lessons/upload"
          variant="light"
          size="sm"
        >
          + Upload New Lesson
        </Button>
      </div>

      {/* Lessons */}
      {lessons.length === 0 ? (
        <div
          style={{
            background: "var(--surface-1)",
            border: "1px solid var(--border-1)",
            borderRadius: "var(--radius)",
            padding: "3.5rem",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>
            <Inbox size={40} />
          </div>
          <p style={{ color: "var(--text-2)", marginBottom: "1.25rem" }}>
            No lessons uploaded for this course yet.
          </p>
          <Button
            as={Link}
            to="/dashboard/instructor/lessons/upload"
            variant="light"
          >
            Upload First Lesson
          </Button>
        </div>
      ) : (
        <Row className="g-3">
          {lessons.map((lesson, idx) => (
            <Col key={lesson._id} xs={12}>
              <LessonCard
                lesson={lesson}
                index={idx}
                onDelete={handleDeleteLesson}
                onPreview={setPreviewLesson}
              />
            </Col>
          ))}
        </Row>
      )}

      {/* Video preview modal */}
      {previewLesson && (
        <VideoModal
          lesson={previewLesson}
          onClose={() => setPreviewLesson(null)}
        />
      )}
    </Container>
  );
}

export default InstructorCourseLessonsPage;
