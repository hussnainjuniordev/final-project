import { useState } from "react";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  GraduationCap,
  BookOpen,
  BookMarked,
  Video,
  BarChart3,
  Trophy,
  Rocket,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import * as authService from "../../services/authService";

function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await authService.register({
        name,
        email,
        password,
        role,
      });
      login(response.data);
      toast.success("Account created successfully! Redirecting...", {
        autoClose: 2000,
      });
      const userRole = response.data.user?.role;
      setTimeout(() => {
        if (userRole === "instructor")
          navigate("/dashboard/instructor/courses");
        else if (userRole === "admin") navigate("/dashboard/admin/users");
        else navigate("/dashboard/my-courses");
      }, 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed", {
        autoClose: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    {
      value: "student",
      icon: GraduationCap,
      label: "Student",
      desc: "Browse & enroll in courses",
    },
    {
      value: "instructor",
      icon: BookOpen,
      label: "Instructor",
      desc: "Create & manage courses",
    },
  ];

  return (
    <div
      style={{
        minHeight: "calc(100vh - var(--navbar-h))",
        display: "flex",
        alignItems: "stretch",
      }}
    >
      <Row className="g-0 w-100">
        {/* ── Left panel ── */}
        <Col
          lg={5}
          className="d-none d-lg-flex"
          style={{
            background:
              "linear-gradient(145deg, #0a0a1a 0%, #1a1040 50%, #0d1a2e 100%)",
            position: "relative",
            overflow: "hidden",
            alignItems: "center",
            justifyContent: "center",
            padding: "4rem 3rem",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "15%",
              right: "10%",
              width: 250,
              height: 250,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(56,239,125,0.18) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "15%",
              left: "5%",
              width: 200,
              height: 200,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(124,111,247,0.2) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />

          <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: 20,
                background: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "2rem",
                margin: "0 auto 2rem",
                boxShadow: "0 8px 32px rgba(56,239,125,0.35)",
              }}
            >
              <Rocket size={40} color="#fff" />
            </div>

            <h2
              style={{
                color: "#fff",
                fontWeight: 800,
                fontSize: "1.8rem",
                marginBottom: "1rem",
                letterSpacing: "-0.5px",
              }}
            >
              Start Learning Today
            </h2>
            <p
              style={{
                color: "rgba(255,255,255,0.55)",
                fontSize: "0.95rem",
                lineHeight: 1.7,
                maxWidth: "280px",
                margin: "0 auto 2.5rem",
              }}
            >
              Join thousands of students and instructors on our platform.
            </p>

            {[
              { icon: BookMarked, text: "80+ courses available" },
              { icon: Video, text: "HD video lessons" },
              { icon: BarChart3, text: "Track your progress" },
              { icon: Trophy, text: "Learn from experts" },
            ].map((f) => {
              const IconComponent = f.icon;
              return (
                <div
                  key={f.text}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    marginBottom: "0.85rem",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: "10px",
                    padding: "0.6rem 1rem",
                  }}
                >
                  <IconComponent
                    size={20}
                    style={{ color: "rgba(255,255,255,0.7)" }}
                  />
                  <span
                    style={{
                      color: "rgba(255,255,255,0.65)",
                      fontSize: "0.875rem",
                    }}
                  >
                    {f.text}
                  </span>
                </div>
              );
            })}
          </div>
        </Col>

        {/* ── Right panel — form ── */}
        <Col
          lg={7}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "3rem 2rem",
            background: "var(--surface-1)",
          }}
        >
          <div style={{ width: "100%", maxWidth: "440px" }}>
            <span className="eyebrow mb-3">Get Started</span>
            <h1
              style={{
                color: "var(--text-1)",
                fontWeight: 800,
                fontSize: "1.9rem",
                marginBottom: "0.5rem",
                letterSpacing: "-0.5px",
              }}
            >
              Create your account
            </h1>
            <p
              style={{
                color: "var(--text-2)",
                fontSize: "0.9rem",
                marginBottom: "2rem",
              }}
            >
              Already have an account?{" "}
              <Link to="/login" style={{ color: "#c4b5fd", fontWeight: 600 }}>
                Sign in
              </Link>
            </p>

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Full Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Min. 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>

              {/* Role selector */}
              <Form.Group className="mb-4">
                <Form.Label>I want to join as</Form.Label>
                <div className="d-flex gap-3">
                  {roles.map((r) => (
                    <div
                      key={r.value}
                      onClick={() => setRole(r.value)}
                      style={{
                        flex: 1,
                        padding: "0.85rem",
                        borderRadius: "var(--radius-sm)",
                        border: `1.5px solid ${role === r.value ? "var(--brand)" : "var(--border-2)"}`,
                        background:
                          role === r.value
                            ? "var(--brand-dim)"
                            : "rgba(255,255,255,0.02)",
                        cursor: "pointer",
                        transition: "all 0.15s",
                        textAlign: "center",
                      }}
                    >
                    <div
                        style={{ marginBottom: "0.4rem", display: "flex", justifyContent: "center" }}
                      >
                        <r.icon size={22} style={{ color: role === r.value ? "#c4b5fd" : "var(--text-2)" }} />
                      </div>
                      <div
                        style={{
                          color: role === r.value ? "#c4b5fd" : "var(--text-1)",
                          fontWeight: 600,
                          fontSize: "0.85rem",
                        }}
                      >
                        {r.label}
                      </div>
                      <div
                        style={{
                          color: "var(--text-3)",
                          fontSize: "0.72rem",
                          marginTop: "0.15rem",
                        }}
                      >
                        {r.desc}
                      </div>
                    </div>
                  ))}
                </div>
              </Form.Group>

              <Button
                variant="light"
                className="w-100"
                type="submit"
                disabled={loading}
                style={{ padding: "0.7rem" }}
              >
                {loading ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Creating account…
                  </>
                ) : (
                  "Create Account →"
                )}
              </Button>
            </Form>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default RegisterPage;
