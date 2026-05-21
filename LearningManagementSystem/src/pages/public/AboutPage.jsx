import { Col, Container, Row } from "react-bootstrap";
import { GraduationCap, BookOpen, BarChart3, Lock, Shield } from "lucide-react";

const features = [
  {
    icon: GraduationCap,
    title: "Learn at Your Own Pace",
    description:
      "Access course videos anytime, anywhere. Students can enroll and revisit lessons whenever they need.",
  },
  {
    icon: BookOpen,
    title: "Expert Instructors",
    description:
      "Courses are created and managed by verified instructors who bring real-world knowledge to every lesson.",
  },
  {
    icon: BarChart3,
    title: "Track Your Progress",
    description:
      "Students can monitor their enrolled courses and pick up right where they left off.",
  },
  {
    icon: Lock,
    title: "Secure & Role-Based",
    description:
      "The platform supports three roles — Admin, Instructor, and Student — each with dedicated dashboards and permissions.",
  },
];

const team = [
  { name: "Admin", role: "Platform Administrator" },
  { name: "Instructor", role: "Course Creator & Educator" },
  { name: "Student", role: "Learner & Course Enrollee" },
];

function AboutPage() {
  return (
    <div className="page-wrap">
      <Container>
        {/* Hero */}
        <Row className="py-5">
          <Col lg={8}>
            <span className="eyebrow mb-3">About Us</span>
            <h1 className="display-5 fw-bold text-white mb-3">
              A Modern Learning Management System
            </h1>
            <p className="lead text-white-50">
              This LMS is a full-stack MERN application built to connect
              students with quality courses and give instructors the tools to
              share their knowledge — all managed through a powerful admin
              dashboard.
            </p>
          </Col>
        </Row>

        {/* Features */}
        <Row className="py-4">
          <Col>
            <div className="section-heading mb-4">
              <span className="eyebrow mb-2">Features</span>
              <h2 className="h3 fw-bold text-white mb-0">
                Why use this platform?
              </h2>
            </div>
            <Row className="g-4">
              {features.map((f) => {
                const IconComponent = f.icon;
                return (
                  <Col key={f.title} md={6}>
                    <div className="feature-card p-4 h-100">
                      <div className="fs-2 mb-3">
                        <IconComponent
                          size={32}
                          style={{ color: "var(--brand)" }}
                        />
                      </div>
                      <h3 className="h5 fw-bold text-white mb-2">{f.title}</h3>
                      <p className="text-white-50 mb-0">{f.description}</p>
                    </div>
                  </Col>
                );
              })}
            </Row>
          </Col>
        </Row>

        {/* Tech Stack */}
        <Row className="py-4">
          <Col lg={8}>
            <div className="section-heading mb-4">
              <span className="eyebrow mb-2">Tech Stack</span>
              <h2 className="h3 fw-bold text-white mb-0">
                Built with the MERN Stack
              </h2>
            </div>
            <ul className="feature-list">
              <li>
                <strong className="text-white">MongoDB & Mongoose</strong> —
                flexible NoSQL database with schema validation
              </li>
              <li>
                <strong className="text-white">Express.js</strong> — RESTful API
                backend with JWT authentication
              </li>
              <li>
                <strong className="text-white">React.js</strong> — dynamic,
                component-based frontend with React Router
              </li>
              <li>
                <strong className="text-white">Node.js</strong> — fast, scalable
                server-side runtime
              </li>
              <li>
                <strong className="text-white">Cloudinary</strong> — cloud-based
                video storage for lesson uploads
              </li>
              <li>
                <strong className="text-white">Bootstrap 5</strong> — responsive
                UI components and layout
              </li>
            </ul>
          </Col>
        </Row>

        {/* Roles */}
        <Row className="py-4 pb-5">
          <Col>
            <div className="section-heading mb-4">
              <span className="eyebrow mb-2">Roles</span>
              <h2 className="h3 fw-bold text-white mb-0">
                Who uses this platform?
              </h2>
            </div>
            <Row className="g-4">
              {team.map((t) => {
                const getIcon = (name) => {
                  if (name === "Admin")
                    return (
                      <Shield size={32} style={{ color: "var(--brand)" }} />
                    );
                  if (name === "Instructor")
                    return (
                      <BookOpen size={32} style={{ color: "var(--brand)" }} />
                    );
                  return (
                    <GraduationCap
                      size={32}
                      style={{ color: "var(--brand)" }}
                    />
                  );
                };
                return (
                  <Col key={t.name} md={4}>
                    <div className="feature-card p-4 text-center h-100">
                      <div className="fs-1 mb-3">{getIcon(t.name)}</div>
                      <h3 className="h5 fw-bold text-white mb-1">{t.name}</h3>
                      <p className="text-white-50 mb-0 small">{t.role}</p>
                    </div>
                  </Col>
                );
              })}
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default AboutPage;
