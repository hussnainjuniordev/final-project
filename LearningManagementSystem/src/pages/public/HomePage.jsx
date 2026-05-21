import { useEffect, useState } from "react";
import { Button, Col, Container, Row, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Users, BookOpen, GraduationCap, Star, Rocket } from "lucide-react";
import CourseCard from "../../components/CourseCard.jsx";
import * as courseService from "../../services/courseService.js";

const stats = [
  { icon: Users, label: "Students Enrolled", value: "1,200+", grad: "linear-gradient(135deg,#6366f1,#8b5cf6)" },
  { icon: BookOpen, label: "Courses Available", value: "80+", grad: "linear-gradient(135deg,#06b6d4,#10b981)" },
  { icon: GraduationCap, label: "Expert Instructors", value: "30+", grad: "linear-gradient(135deg,#3b82f6,#6366f1)" },
  { icon: Star, label: "Satisfaction Rate", value: "98%", grad: "linear-gradient(135deg,#f59e0b,#ef4444)" },
];

function HomePage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await courseService.getCourses();
        setCourses(res.data.slice(0, 3));
      } catch (err) {
        console.error("Failed to load featured courses:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="page-wrap">
      <Container>
        {/* ── Hero ── */}
        <div className="hero-section">
          <div className="hero-grid" />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div className="hero-badge">
              <Rocket size={14} />
              Full-Stack MERN Application
            </div>
            <h1>
              Learn, Teach &amp; Grow —<br />
              <span className="highlight">All in One Place.</span>
            </h1>
            <p>
              Browse hundreds of courses, enroll instantly, and watch video
              lessons. Instructors can create and manage courses with ease.
            </p>
            <div className="d-flex gap-3 flex-wrap">
              <Button as={Link} to="/register" variant="light" size="lg">
                Get Started Free →
              </Button>
              <Button as={Link} to="/courses" variant="outline-light" size="lg">
                Browse Courses
              </Button>
            </div>
          </div>
        </div>

        {/* ── Stats ── */}
        <Row className="g-3 mb-5">
          {stats.map((s) => {
            const IconComponent = s.icon;
            return (
              <Col key={s.label} xs={6} md={3}>
                <div className="stat-card">
                  <div className="stat-icon" style={{ background: s.grad }}>
                    <IconComponent size={26} color="#fff" />
                  </div>
                  <div
                    className="fw-bold"
                    style={{ fontSize: "1.6rem", color: "var(--text-1)", letterSpacing: "-0.5px" }}
                  >
                    {s.value}
                  </div>
                  <div
                    style={{
                      color: "var(--text-3)",
                      fontSize: "0.78rem",
                      marginTop: "0.2rem",
                      fontWeight: 500,
                    }}
                  >
                    {s.label}
                  </div>
                </div>
              </Col>
            );
          })}
        </Row>

        {/* ── Featured Courses ── */}
        <div className="section-heading mb-4">
          <span className="eyebrow mb-2">Featured</span>
          <h2 className="h3 fw-bold mb-0" style={{ color: "var(--text-1)" }}>
            Popular Courses
          </h2>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" />
            <p className="mt-3" style={{ color: "var(--text-2)" }}>
              Loading courses...
            </p>
          </div>
        ) : courses.length > 0 ? (
          <>
            <Row className="g-4 mb-4">
              {courses.map((course) => (
                <Col key={course._id} xs={12} md={4}>
                  <CourseCard course={course} />
                </Col>
              ))}
            </Row>
            <div className="text-center">
              <Button as={Link} to="/courses" variant="outline-light">
                Browse All Courses →
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-5">
            <p style={{ color: "var(--text-2)" }}>No courses available yet.</p>
            <Button
              as={Link}
              to="/courses"
              variant="outline-light"
              className="mt-2"
            >
              Browse All Courses
            </Button>
          </div>
        )}
      </Container>
    </div>
  );
}

export default HomePage;
