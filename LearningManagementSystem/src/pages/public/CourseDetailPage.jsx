import { useEffect, useState } from "react";
import { Badge, Button, Col, Container, Row, Spinner } from "react-bootstrap";
import { Link, useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { BookOpen, Check, Play, Trash2, Inbox, Lock } from "lucide-react";
import VideoPlayer from "../../components/VideoPlayer.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import * as courseService from "../../services/courseService.js";
import * as enrollmentService from "../../services/enrollmentService.js";
import * as lessonService from "../../services/lessonService.js";

function CourseDetailPage() {
  const { id } = useParams();
  const { role } = useAuth();
  const location = useLocation();

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [activeLesson, setActiveLesson] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [watchedIds, setWatchedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enrolling, setEnrolling] = useState(false);
  const [marking, setMarking] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  /* ── data fetchers ── */
  const fetchLessons = async () => {
    try {
      const res = await lessonService.getLessons(id);
      setLessons(res.data);
      if (res.data.length > 0) setActiveLesson(res.data[0]);
    } catch (err) {
      console.error(
        "Failed to fetch lessons:",
        err.response?.status,
        err.response?.data?.message || err.message,
      );
    }
  };

  const fetchProgress = async () => {
    try {
      const res = await enrollmentService.getProgress(id);
      setWatchedIds(res.data.watchedLessons.map(String));
    } catch (err) {
      console.error("Failed to fetch progress:", err.message);
    }
  };

  const checkEnrollment = async () => {
    try {
      const res = await enrollmentService.getMyCourses();
      const enrolled = res.data.some((e) => (e.course?._id || e._id) === id);
      setIsEnrolled(enrolled);
      if (enrolled) {
        await fetchLessons();
        await fetchProgress();
      }
    } catch (err) {
      console.error("Failed to check enrollment:", err.message);
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await courseService.getCourseById(id);
        setCourse(res.data);
        if (role === "student") {
          await checkEnrollment();
        } else if (role === "instructor" || role === "admin") {
          await fetchLessons();
        } else {
          // Unauthenticated — fetch lesson list for preview (titles only, no playback)
          try {
            const lessonRes = await lessonService.getLessons(id);
            setLessons(lessonRes.data);
          } catch {
            // Backend may return 401 for unauthenticated — that's fine, show empty list
          }
        }
      } catch (err) {
        console.error("Failed to load course details:", err);
        setError("Failed to load course details.");
        toast.error("Failed to load course details.");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [id, role]);

  /* ── enroll ── */
  const handleEnroll = async () => {
    setEnrolling(true);
    try {
      await enrollmentService.enroll(id);
      setIsEnrolled(true);
      toast.success("Enrolled successfully!");
      await fetchLessons();
      await fetchProgress();
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to enroll. Please try again.",
      );
    } finally {
      setEnrolling(false);
    }
  };

  /* ── mark watched (manual or auto on video end) ── */
  const markCurrentWatched = async (lessonId) => {
    if (!lessonId || role !== "student") return;
    if (watchedIds.includes(String(lessonId))) return; // already watched
    setMarking(true);
    try {
      const res = await enrollmentService.markWatched(id, lessonId);
      setWatchedIds(res.data.watchedLessons.map(String));
    } catch (err) {
      console.error("Failed to mark as watched:", err.message);
    } finally {
      setMarking(false);
    }
  };

  /* called by VideoPlayer when video finishes */
  const handleVideoEnded = () => {
    if (activeLesson) markCurrentWatched(activeLesson._id);
  };

  /* ── delete lesson (admin / instructor) ── */
  const handleDeleteLesson = async (lessonId) => {
    if (!window.confirm("Delete this lesson? This cannot be undone.")) return;
    setDeletingId(lessonId);
    try {
      await lessonService.deleteLesson(lessonId);
      const updated = lessons.filter((l) => l._id !== lessonId);
      setLessons(updated);
      toast.success("Lesson deleted successfully!");
      // if deleted lesson was active, switch to first remaining
      if (activeLesson?._id === lessonId) {
        setActiveLesson(updated.length > 0 ? updated[0] : null);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete lesson.");
    } finally {
      setDeletingId(null);
    }
  };

  /* ── derived ── */
  const canAccessLessons = isEnrolled || role !== "student";
  const watchedCount = watchedIds.length;
  const progressPct =
    lessons.length > 0 ? Math.round((watchedCount / lessons.length) * 100) : 0;
  const canDelete = role === "admin" || role === "instructor";

  /* ── loading / error states ── */
  if (loading) {
    return (
      <Container className="page-section py-5 text-center">
        <Spinner animation="border" />
        <p className="mt-3" style={{ color: "var(--text-2)" }}>
          Loading course...
        </p>
      </Container>
    );
  }

  if (error && !course) {
    return (
      <Container className="page-section py-5">
        <p style={{ color: "var(--text-2)" }}>Could not load course details.</p>
      </Container>
    );
  }

  return (
    <Container className="page-section py-4">
      {course && (
        <>
          {/* ── Course Header ── */}
          <div
            style={{
              background: "var(--surface-1)",
              border: "1px solid var(--border-1)",
              borderRadius: "var(--radius)",
              padding: "1.75rem 2rem",
              marginBottom: "1.5rem",
            }}
          >
            <div className="d-flex flex-wrap justify-content-between align-items-start gap-3">
              <div style={{ flex: 1, minWidth: 0 }}>
                <Badge bg="secondary" className="mb-2">
                  {course.category}
                </Badge>
                <h1
                  className="fw-bold mb-2"
                  style={{ color: "var(--text-1)", fontSize: "1.6rem" }}
                >
                  {course.title}
                </h1>
                <p
                  style={{
                    color: "var(--text-2)",
                    marginBottom: "0.75rem",
                    maxWidth: "640px",
                  }}
                >
                  {course.description}
                </p>
                <div className="d-flex flex-wrap gap-3 align-items-center">
                  {course.instructor?.name && (
                    <span
                      style={{ color: "var(--text-3)", fontSize: "0.85rem" }}
                    >
                      <BookOpen size={16} style={{ marginRight: "0.3rem" }} />{" "}
                      <span style={{ color: "var(--text-2)" }}>
                        {course.instructor.name}
                      </span>
                    </span>
                  )}
                  <span style={{ color: "var(--text-3)", fontSize: "0.85rem" }}>
                    <BookOpen size={16} /> {lessons.length} lesson
                    {lessons.length !== 1 ? "s" : ""}
                  </span>
                  <span
                    style={{
                      color: "var(--brand)",
                      fontWeight: 700,
                      fontSize: "1rem",
                    }}
                  >
                    {course.price === 0 ? "Free" : `$${course.price}`}
                  </span>
                </div>
              </div>

              {/* Enroll button */}
              {role === "student" && !isEnrolled && (
                <Button
                  variant="light"
                  onClick={handleEnroll}
                  disabled={enrolling}
                  style={{ whiteSpace: "nowrap" }}
                >
                  {enrolling ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Enrolling...
                    </>
                  ) : (
                    `Enroll Now — ${course.price === 0 ? "Free" : `$${course.price}`}`
                  )}
                </Button>
              )}

              {/* Circular progress for enrolled students */}
              {role === "student" && isEnrolled && (
                <div style={{ textAlign: "center", minWidth: "90px" }}>
                  <div
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: "50%",
                      background: `conic-gradient(var(--brand) ${progressPct * 3.6}deg, var(--surface-3) 0deg)`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 0.4rem",
                    }}
                  >
                    <div
                      style={{
                        width: 50,
                        height: 50,
                        borderRadius: "50%",
                        background: "var(--surface-1)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                        fontSize: "0.85rem",
                        color: "var(--brand)",
                      }}
                    >
                      {progressPct}%
                    </div>
                  </div>
                  <div style={{ color: "var(--text-3)", fontSize: "0.75rem" }}>
                    {watchedCount}/{lessons.length} watched
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── Main Content ── */}
          {canAccessLessons && lessons.length > 0 && (
            <Row className="g-4">
              {/* ── Left: Video Player ── */}
              <Col lg={8}>
                {activeLesson ? (
                  <>
                    {/* Lesson header */}
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div>
                        <div
                          style={{
                            color: "var(--text-3)",
                            fontSize: "0.75rem",
                            marginBottom: "0.2rem",
                          }}
                        >
                          Lesson{" "}
                          {lessons.findIndex(
                            (l) => l._id === activeLesson._id,
                          ) + 1}{" "}
                          of {lessons.length}
                        </div>
                        <h2
                          style={{
                            color: "var(--text-1)",
                            fontSize: "1.1rem",
                            fontWeight: 600,
                            margin: 0,
                          }}
                        >
                          {activeLesson.title}
                        </h2>
                      </div>

                      {/* Student: manual mark watched */}
                      {role === "student" &&
                        (watchedIds.includes(String(activeLesson._id)) ? (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "0.4rem",
                              color: "var(--brand)",
                              fontSize: "0.85rem",
                              fontWeight: 600,
                            }}
                          >
                            <span
                              style={{
                                width: 22,
                                height: 22,
                                borderRadius: "50%",
                                background: "var(--brand)",
                                color: "#0d1117",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "0.7rem",
                                fontWeight: 800,
                              }}
                            >
                              <Check size={14} />
                            </span>
                            Watched
                          </div>
                        ) : (
                          <Button
                            variant="outline-light"
                            size="sm"
                            onClick={() => markCurrentWatched(activeLesson._id)}
                            disabled={marking}
                          >
                            {marking ? (
                              <Spinner animation="border" size="sm" />
                            ) : (
                              <>
                                <Check size={16} /> Mark as Watched
                              </>
                            )}
                          </Button>
                        ))}
                    </div>

                    {/* Video — fires onEnded to auto-mark watched */}
                    <VideoPlayer
                      url={activeLesson.videoUrl}
                      title={activeLesson.title}
                      onEnded={handleVideoEnded}
                    />

                    {/* Prev / Next */}
                    <div className="d-flex justify-content-between mt-3">
                      <Button
                        variant="outline-light"
                        size="sm"
                        disabled={
                          lessons.findIndex(
                            (l) => l._id === activeLesson._id,
                          ) === 0
                        }
                        onClick={() => {
                          const idx = lessons.findIndex(
                            (l) => l._id === activeLesson._id,
                          );
                          if (idx > 0) setActiveLesson(lessons[idx - 1]);
                        }}
                      >
                        ← Previous
                      </Button>
                      <Button
                        variant="outline-light"
                        size="sm"
                        disabled={
                          lessons.findIndex(
                            (l) => l._id === activeLesson._id,
                          ) ===
                          lessons.length - 1
                        }
                        onClick={() => {
                          const idx = lessons.findIndex(
                            (l) => l._id === activeLesson._id,
                          );
                          if (idx < lessons.length - 1)
                            setActiveLesson(lessons[idx + 1]);
                        }}
                      >
                        Next →
                      </Button>
                    </div>
                  </>
                ) : (
                  <p style={{ color: "var(--text-2)" }}>
                    Select a lesson to start watching.
                  </p>
                )}
              </Col>

              {/* ── Right: Lesson Sidebar ── */}
              <Col lg={4}>
                <div
                  style={{
                    background: "var(--surface-1)",
                    border: "1px solid var(--border-1)",
                    borderRadius: "var(--radius)",
                    overflow: "hidden",
                  }}
                >
                  {/* Sidebar header */}
                  <div
                    style={{
                      padding: "1rem 1.25rem",
                      borderBottom: "1px solid var(--border-1)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        color: "var(--text-1)",
                        fontWeight: 600,
                        fontSize: "0.9rem",
                      }}
                    >
                      Course Content
                    </span>
                    <span
                      style={{ color: "var(--text-3)", fontSize: "0.78rem" }}
                    >
                      {lessons.length} lesson{lessons.length !== 1 ? "s" : ""}
                    </span>
                  </div>

                  {/* Lesson list */}
                  <div style={{ maxHeight: "520px", overflowY: "auto" }}>
                    {lessons.map((lesson, idx) => {
                      const isActive = activeLesson?._id === lesson._id;
                      const isWatched = watchedIds.includes(String(lesson._id));
                      const isDeleting = deletingId === lesson._id;

                      return (
                        <div
                          key={lesson._id}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.75rem",
                            padding: "0.85rem 1.25rem",
                            borderBottom: "1px solid var(--border-1)",
                            background: isActive
                              ? "rgba(20,184,166,0.08)"
                              : "transparent",
                            borderLeft: isActive
                              ? "3px solid var(--brand)"
                              : "3px solid transparent",
                            transition: "background 0.15s",
                          }}
                        >
                          {/* Number / watched circle */}
                          <div
                            onClick={() => setActiveLesson(lesson)}
                            style={{
                              width: 32,
                              height: 32,
                              borderRadius: "50%",
                              flexShrink: 0,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "0.78rem",
                              fontWeight: 700,
                              cursor: "pointer",
                              background: isWatched
                                ? "var(--brand)"
                                : isActive
                                  ? "rgba(20,184,166,0.2)"
                                  : "var(--surface-3)",
                              color: isWatched
                                ? "#0d1117"
                                : isActive
                                  ? "var(--brand)"
                                  : "var(--text-3)",
                              border:
                                isActive && !isWatched
                                  ? "1.5px solid var(--brand)"
                                  : "1.5px solid transparent",
                            }}
                          >
                            {isWatched ? <Check size={18} /> : idx + 1}
                          </div>

                          {/* Title */}
                          <div
                            onClick={() => setActiveLesson(lesson)}
                            style={{ flex: 1, minWidth: 0, cursor: "pointer" }}
                          >
                            <div
                              style={{
                                color: isActive
                                  ? "var(--brand)"
                                  : "var(--text-1)",
                                fontWeight: isActive ? 600 : 400,
                                fontSize: "0.875rem",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {lesson.title}
                            </div>
                            {isWatched && (
                              <div
                                style={{
                                  color: "var(--brand)",
                                  fontSize: "0.7rem",
                                  marginTop: "0.1rem",
                                }}
                              >
                                Completed
                              </div>
                            )}
                          </div>

                          {/* Play icon (non-delete roles) */}
                          {!canDelete && (
                            <div
                              style={{
                                color: isActive
                                  ? "var(--brand)"
                                  : "var(--text-3)",
                                fontSize: "0.7rem",
                                flexShrink: 0,
                              }}
                            >
                              <Play size={14} />
                            </div>
                          )}

                          {/* Delete button (admin / instructor) */}
                          {canDelete && (
                            <button
                              onClick={() => handleDeleteLesson(lesson._id)}
                              disabled={isDeleting}
                              title="Delete lesson"
                              style={{
                                flexShrink: 0,
                                background: "none",
                                border: "1px solid rgba(248,113,113,0.3)",
                                borderRadius: "6px",
                                color: "var(--red, #f87171)",
                                cursor: "pointer",
                                padding: "0.2rem 0.45rem",
                                fontSize: "0.75rem",
                                lineHeight: 1,
                                transition:
                                  "background 0.15s, border-color 0.15s",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background =
                                  "rgba(248,113,113,0.12)";
                                e.currentTarget.style.borderColor =
                                  "rgba(248,113,113,0.7)";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = "none";
                                e.currentTarget.style.borderColor =
                                  "rgba(248,113,113,0.3)";
                              }}
                            >
                              {isDeleting ? "..." : <Trash2 size={16} />}
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Col>
            </Row>
          )}

          {/* No lessons yet */}
          {canAccessLessons && lessons.length === 0 && (
            <div
              style={{
                background: "var(--surface-1)",
                border: "1px solid var(--border-1)",
                borderRadius: "var(--radius)",
                padding: "3rem",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>
                <Inbox size={40} />
              </div>
              <p style={{ color: "var(--text-2)", margin: 0 }}>
                No lessons available yet.
              </p>
            </div>
          )}

          {/* Unauthenticated CTA */}
          {!role && (
            <div
              style={{
                background: "var(--surface-1)",
                border: "1px solid var(--border-brand)",
                borderRadius: "var(--radius)",
                padding: "3rem",
                textAlign: "center",
                marginTop: "1rem",
              }}
            >
              <Lock size={36} style={{ color: "var(--brand)", marginBottom: "1rem" }} />
              <h3 style={{ color: "var(--text-1)", fontWeight: 700, marginBottom: "0.5rem" }}>
                Sign in to access this course
              </h3>
              <p style={{ color: "var(--text-2)", marginBottom: "1.5rem", maxWidth: 380, margin: "0 auto 1.5rem" }}>
                Create a free account or log in to enroll and start watching lessons.
              </p>
              <div className="d-flex gap-3 justify-content-center flex-wrap">
                <Button
                  as={Link}
                  to="/login"
                  state={{ from: location }}
                  variant="light"
                >
                  Log In
                </Button>
                <Button
                  as={Link}
                  to="/register"
                  variant="outline-light"
                >
                  Create Free Account
                </Button>
              </div>
            </div>
          )}

          {/* Not enrolled CTA */}
          {role === "student" && !isEnrolled && (
            <div style={{ background: "var(--surface-1)", border: "1px solid var(--border-1)", borderRadius: "var(--radius)", padding: "3rem", textAlign: "center", marginTop: "1rem" }}>
              <Lock size={32} style={{ margin: "0 auto 1rem", color: "var(--text-3)" }} />
              <p style={{ color: "var(--text-2)", marginBottom: "1.25rem" }}>
                Enroll in this course to access all lessons.
              </p>
              <Button variant="light" onClick={handleEnroll} disabled={enrolling}>
                {enrolling ? (<><Spinner animation="border" size="sm" className="me-2" />Enrolling...</>) : `Enroll Now — ${course.price === 0 ? "Free" : `$${course.price}`}`}
              </Button>
            </div>
          )}


        </>
      )}
    </Container>
  );
}

export default CourseDetailPage;
