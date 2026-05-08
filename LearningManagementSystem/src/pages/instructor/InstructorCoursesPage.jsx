import { useEffect, useState } from "react";
import { Badge, Button, Col, Container, Row, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Trash2, Inbox, BookOpen } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import * as courseService from "../../services/courseService.js";
import * as lessonService from "../../services/lessonService.js";

/* ── Course Card ───────────────────────────────────────── */
function CourseCard({ course, onDelete }) {
  const navigate = useNavigate();
  const [lessonCount, setLessonCount] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Fetch lesson count on mount
  useEffect(() => {
    let cancelled = false;
    lessonService
      .getLessons(course._id)
      .then((res) => {
        if (!cancelled) setLessonCount(res.data.length);
      })
      .catch(() => {
        if (!cancelled) setLessonCount(0);
      });
    return () => {
      cancelled = true;
    };
  }, [course._id]);

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!window.confirm("Delete this course? This cannot be undone.")) return;
    setDeleting(true);
    try {
      await courseService.deleteCourse(course._id);
      toast.success("Course deleted successfully!");
      onDelete(course._id);
    } catch (err) {
      toast.error("Failed to delete course.");
      setDeleting(false);
    }
  };

  return (
    <div
      style={{
        background: "var(--surface-1)",
        border: "1px solid var(--border-1)",
        borderRadius: "var(--radius)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        transition: "border-color 0.2s, transform 0.2s",
        // cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--brand-border)";
        e.currentTarget.style.transform = "translateY(-3px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--border-1)";
        e.currentTarget.style.transform = "none";
      }}
      // onClick={() =>
      //   navigate(`/dashboard/instructor/courses/${course._id}/lessons`)
      // }
    >
      {/* Top color bar */}
      <div
        style={{
          height: "4px",
          background: "linear-gradient(90deg, var(--brand), #60a5fa)",
        }}
      />
        {/*  instructor course card   */}
      <div
        style={{
          padding: "1.25rem",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        {/* Category + Price */}
        <div className="d-flex justify-content-between align-items-center">
          <Badge bg="secondary">{course.category}</Badge>
          <span
            style={{
              color: "var(--brand)",
              fontWeight: 700,
              fontSize: "0.rem",
            }}
          >
            {course.price === 0 ? "Free" : `$${course.price}`}
          </span>
        </div>

        {/* Title */}
        <div
          style={{
            color: "var(--text-1)",
            fontWeight: 700,
            fontSize: "1rem",
            lineHeight: 1.4,
          }}
        >
          {course.title}
        </div>

        {/* Description */}
        <div
          style={{
            color: "var(--text-2)",
            fontSize: "1rem",
            lineHeight: 1.6,
            flex: 1,
          }}
        >
          {course.description?.length > 90
            ? course.description.slice(0, 90) + "…"
            : course.description}
        </div>

        {/* Lesson count */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            background: "var(--surface-2)",
            border: "1px solid var(--border-1)",
            borderRadius: "var(--radius-sm)",
            padding: "0.6rem 0.85rem",
          }}
        >
          <span style={{ fontSize: "1rem" }}>
            <BookOpen size={16} style={{ marginRight: "0.3rem" }} />
          </span>
          <span style={{ color: "var(--text-2)", fontSize: "0.85rem" }}>
            {lessonCount === null
              ? "Loading lessons..."
              : `${lessonCount} lesson${lessonCount !== 1 ? "s" : ""} uploaded`}
          </span>
        </div>

        {/* Actions */}
        <div className="d-flex gap-2 mt-1" onClick={(e) => e.stopPropagation()}>
          <Button
            as={Link}
            to={`/dashboard/instructor/courses/${course._id}/lessons`}
            variant="light"
            size="sm"
            className="flex-grow-1"
          >
            View Lessons
          </Button>
          <Button
            as={Link}
            to={`/dashboard/instructor/courses/${course._id}/edit`}
            variant="outline-light"
            size="sm"
          >
            Edit
          </Button>
          <Button
            variant="outline-danger"
            size="sm"
            disabled={deleting}
            onClick={handleDelete}
          >
            {deleting ? "..." : <Trash2 size={16} />}
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ── Main Page ─────────────────────────────────────────── */
function InstructorCoursesPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const res = await courseService.getCourses();
        if (!cancelled) {
          setCourses(res.data.filter((c) => c.instructor?._id === user?._id));
        }
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
  }, [user?._id]);

  const handleDelete = (id) =>
    setCourses((prev) => prev.filter((c) => c._id !== id));

  return (
    <Container className="page-section py-5">
      {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
        <div className="section-heading">
          <span className="eyebrow mb-1">Instructor</span>
          <h1 className="h2 fw-bold mb-0" style={{ color: "var(--text-1)" }}>
            My Courses
          </h1>
        </div>
        <Button
          as={Link}
          to="/dashboard/instructor/courses/new"
          variant="light"
        >
          + Create New Course
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" />
          <p className="mt-3" style={{ color: "var(--text-2)" }}>
            Loading your courses...
          </p>
        </div>
      ) : courses.length === 0 ? (
        <div
          style={{
            background: "var(--surface-1)",
            border: "1px solid var(--border-1)",
            borderRadius: "var(--radius)",
            padding: "4rem",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>
            <Inbox size={40} />
          </div>
          <p style={{ color: "var(--text-2)", marginBottom: "1.25rem" }}>
            You haven't created any courses yet.
          </p>
          <Button
            as={Link}
            to="/dashboard/instructor/courses/new"
            variant="light"
          >
            Create Your First Course
          </Button>
        </div>
      ) : (
        <Row className="g-4">
          {courses.map((course) => (
            <Col key={course._id} sm={6} lg={4}>
              <CourseCard course={course} onDelete={handleDelete} />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}

export default InstructorCoursesPage;
